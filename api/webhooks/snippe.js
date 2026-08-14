const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    const payload = req.body;
    const headers = req.headers;

    console.log('📩 Snippe Webhook received (KISA)');

    const eventType =
      headers['x-webhook-event'] ||
      headers['x-snippe-event'] ||
      payload.type ||
      payload.event;

    const data = payload.data || payload;
    const paymentType = data?.metadata?.type;
    const reference = data?.metadata?.reference;
    const transactionId = data?.metadata?.transaction_id;
    const userId = data?.metadata?.user_id;
    const fallbackRef = data?.external_reference || data?.reference;

    if (
      !eventType?.includes('payment.completed') &&
      !eventType?.includes('payment.succeeded')
    ) {
      return res.json({ received: true, processed: false });
    }

    if (!reference && !transactionId && !fallbackRef) {
      return res.status(400).json({ error: 'Missing reference' });
    }

    if (paymentType === 'kisa_subscription') {
      let query = supabaseAdmin.from('subscription_transactions').select('*');
      if (transactionId) query = query.eq('id', transactionId);
      else if (reference) query = query.eq('reference', reference);
      else query = query.eq('reference', fallbackRef);

      const { data: transaction, error: txError } = await query.single();
      if (txError || !transaction) {
        return res.status(404).json({ error: 'Subscription transaction not found' });
      }

      await supabaseAdmin
        .from('subscription_transactions')
        .update({
          status: 'completed',
          webhook_payload: data,
        })
        .eq('id', transaction.id);

      const { error: rpcError } = await supabaseAdmin.rpc('kisa_activate_subscription', {
        p_user_id: transaction.user_id || userId,
        p_transaction_id: transaction.id,
        p_reference: transaction.reference
      });

      if (rpcError) {
        console.error('Failed to activate subscription via RPC:', rpcError);
        return res.status(500).json({ error: 'Failed to activate subscription' });
      }

      console.log(`✅ Subscription activated for user ${transaction.user_id}`);

      return res.json({
        received: true,
        processed: true,
        type: 'kisa_subscription',
        status: 'active',
      });
    }

    return res.json({ received: true, processed: false, reason: 'unhandled payment type' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
