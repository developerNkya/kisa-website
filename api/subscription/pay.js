const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

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
    const { userId, storyId, paymentMethod = 'mobile', customer, mobileNetwork } = req.body;

    if (!userId || !customer) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    let amount = 2000;
    let storyTitle = 'KISA Story';

    // If purchasing a specific story, fetch the story price and title
    if (storyId) {
      const { data: story, error: storyError } = await supabaseAdmin
        .from('stories')
        .select('id, title, price')
        .eq('id', storyId)
        .single();

      if (storyError || !story) {
        return res.status(404).json({ success: false, error: 'Story not found' });
      }

      amount = story.price || 1000;
      storyTitle = story.title;
    }

    const reference = storyId 
      ? `KSP-${storyId.slice(0, 4)}-${userId.slice(0, 4)}-${Date.now()}`
      : `KSB-${userId.slice(0, 8)}-${Date.now()}`;

    const { data: transaction, error: txError } = await supabaseAdmin
      .from('subscription_transactions')
      .insert({
        user_id: userId,
        story_id: storyId || null,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
        reference,
        customer_name: `${customer.firstname || customer.fullName || ''} ${customer.lastname || ''}`.trim() || 'Msomaji wa KISA',
        customer_phone: customer.phone_number || customer.phone,
        customer_email: customer.email,
      })
      .select()
      .single();

    if (txError) {
      console.error('Payment transaction insert error:', txError);
      return res.status(500).json({ success: false, error: 'Failed to create transaction' });
    }

    let rawPhone = customer.phone_number || customer.phone || '';
    let phoneNumber = String(rawPhone).replace(/^\+/, '').replace(/\D/g, '');
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
        details: { 
          amount, 
          currency: 'TZS',
          description: `Malipo ya hadithi: ${storyTitle}`
        },
        customer: {
          firstname: (customer.firstname || customer.fullName || 'Msomaji').trim(),
          lastname: (customer.lastname || '').trim(),
          email: (customer.email || 'reader@kisa.co.tz').trim(),
        },
        metadata: {
          type: storyId ? 'story_purchase' : 'kisa_subscription',
          story_id: storyId || null,
          story_title: storyTitle,
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
          'Idempotency-Key': `pay-${reference}`,
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
      story_title: storyTitle,
      message:
        paymentMethod === 'mobile'
          ? `Ombi la malipo ya TZS ${amount.toLocaleString()} limetumwa kwenye simu yako`
          : 'Elekezwa kwenye ukurasa wa malipo',
    });
  } catch (error) {
    console.error('Story pay error:', error);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Payment initiation failed',
    });
  }
};
