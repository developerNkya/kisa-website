const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const PRICE_FLAT = 2000;

module.exports = async function handler(req, res) {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  );

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { userId, paymentMethod, customer, mobileNetwork } = req.body;

    if (!userId || !paymentMethod || !customer) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const amount = PRICE_FLAT;
    const reference = `KSB-${userId.slice(0, 8)}-${Date.now()}`;

    const { data: activeSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    const { data: transaction, error: txError } = await supabaseAdmin
      .from('subscription_transactions')
      .insert({
        user_id: userId,
        subscription_id: activeSub?.id || null,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
        reference,
        customer_name: `${customer.firstname} ${customer.lastname}`.trim(),
        customer_phone: customer.phone_number,
        customer_email: customer.email,
      })
      .select()
      .single();

    if (txError) {
      console.error('Subscription transaction error:', txError);
      return res.status(500).json({ success: false, error: 'Failed to create transaction' });
    }

    let phoneNumber = String(customer.phone_number).replace(/^\+/, '').replace(/\D/g, '');
    if (phoneNumber.startsWith('0')) phoneNumber = '255' + phoneNumber.substring(1);

    let paymentUrl = null;
    const snippeKey = process.env.SNIPPE_API_KEY;

    if (snippeKey) {
      let webhookUrl =
        process.env.SNIPPE_WEBHOOK_URL || 'https://kisa.co.tz/api/webhooks/snippe';
      if (webhookUrl.includes('localhost')) {
        webhookUrl = 'https://kisa.co.tz/api/webhooks/snippe';
      }

      const snippePayload = {
        payment_type: paymentMethod,
        webhook_url: webhookUrl,
        external_reference: reference,
        phone_number: phoneNumber,
        details: { amount, currency: 'TZS' },
        customer: {
          firstname: customer.firstname.trim(),
          lastname: customer.lastname.trim(),
          email: customer.email.trim(),
        },
        metadata: {
          type: 'kisa_subscription',
          user_id: userId,
          reference,
          transaction_id: transaction.id,
          amount,
          mobile_network: mobileNetwork || null,
        },
      };

      const baseUrl = process.env.SNIPPE_API_BASE_URL || 'https://api.snippe.sh';
      const snippeResponse = await axios.post(`${baseUrl}/api/v1/payments`, snippePayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${snippeKey}`,
          'Idempotency-Key': `sub-${reference}`,
        },
        timeout: 30000,
      });

      paymentUrl = snippeResponse.data?.data?.checkout_url || null;
      
      const snippeReference = snippeResponse.data?.data?.reference || null;
      if (snippeReference) {
        await supabaseAdmin
            .from('subscription_transactions')
            .update({ snippe_reference: snippeReference })
            .eq('id', transaction.id);
      }
    }

    if (paymentUrl) {
      await supabaseAdmin
        .from('subscription_transactions')
        .update({ payment_url: paymentUrl })
        .eq('id', transaction.id);
    }

    return res.json({
      success: true,
      reference,
      transaction_id: transaction.id,
      payment_url: paymentUrl,
      amount,
      message:
        paymentMethod === 'mobile'
          ? 'Payment request sent to your phone'
          : 'Redirect to payment page',
    });
  } catch (error) {
    console.error('Subscription pay error:', error);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Payment initiation failed',
    });
  }
};
