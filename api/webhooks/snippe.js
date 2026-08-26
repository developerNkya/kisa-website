const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    console.log('📩 Webhook received at:', new Date().toISOString());
    console.log('📩 Payload:', JSON.stringify(payload, null, 2));

    const eventData = payload.data || payload;
    const metadata = eventData.metadata || {};

    const paymentType = metadata.type || eventData.type;
    const reference = metadata.reference || eventData.external_reference || eventData.reference;
    const transactionId = metadata.transaction_id;
    const userId = metadata.user_id;
    const storyId = metadata.story_id;
    const amount = metadata.amount || eventData.amount?.value || 1000;
    const status = eventData.status || metadata.status;

    console.log('📊 Extracted:', { 
      paymentType, 
      reference, 
      transactionId, 
      userId, 
      storyId, 
      amount, 
      status 
    });

    // Initialize Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://ucyyxukvxkouvwlvzhnb.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔑 Supabase URL:', supabaseUrl);
    console.log('🔑 Supabase Key present:', !!supabaseKey);

    if (!supabaseKey) {
      console.error('❌ Missing Supabase key');
      return res.status(500).json({ error: 'Missing Supabase key' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // ── Handle Story Purchase ──────────────────────────────────
    if (paymentType === 'story_purchase' || storyId) {
      console.log('🔄 Processing story purchase...');

      // Try to find transaction
      let transaction = null;

      // Try by transaction_id first
      if (transactionId) {
        console.log('🔍 Looking by transaction_id:', transactionId);
        const { data, error } = await supabaseAdmin
          .from('subscription_transactions')
          .select('*')
          .eq('id', transactionId)
          .maybeSingle();
        
        if (data) {
          transaction = data;
          console.log('✅ Found transaction by ID');
        } else {
          console.log('❌ Not found by ID, error:', error?.message);
        }
      }

      // If not found, try by reference
      if (!transaction && reference) {
        console.log('🔍 Looking by reference:', reference);
        const { data, error } = await supabaseAdmin
          .from('subscription_transactions')
          .select('*')
          .eq('reference', reference)
          .maybeSingle();
        
        if (data) {
          transaction = data;
          console.log('✅ Found transaction by reference');
        } else {
          console.log('❌ Not found by reference, error:', error?.message);
        }
      }

      // If not found, try by external_reference
      if (!transaction && eventData.external_reference) {
        console.log('🔍 Looking by external_reference:', eventData.external_reference);
        const { data, error } = await supabaseAdmin
          .from('subscription_transactions')
          .select('*')
          .eq('reference', eventData.external_reference)
          .maybeSingle();
        
        if (data) {
          transaction = data;
          console.log('✅ Found transaction by external_reference');
        }
      }

      if (!transaction) {
        console.log('❌ Transaction not found!');
        return res.status(404).json({ 
          error: 'Transaction not found',
          searched: { transactionId, reference, externalReference: eventData.external_reference }
        });
      }

      console.log('✅ Transaction found:', transaction.id);
      console.log('📊 Current status:', transaction.status);
      console.log('📊 Transaction data:', JSON.stringify(transaction, null, 2));

      // Update transaction to completed
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('subscription_transactions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
          snippe_reference: eventData.external_reference || reference,
          webhook_payload: payload,
        })
        .eq('id', transaction.id)
        .select();

      if (updateError) {
        console.error('❌ Error updating transaction:', updateError);
        console.error('❌ Error details:', updateError.message, updateError.details);
        return res.status(500).json({ 
          error: 'Failed to update transaction', 
          details: updateError.message 
        });
      }

      console.log('✅ Transaction updated successfully:', updateData);

      // Add to story_purchases
      const targetStoryId = transaction.story_id || storyId;
      const targetUserId = transaction.user_id || userId;
      const targetAmount = transaction.amount || amount;

      if (targetStoryId && targetUserId) {
        console.log('📝 Adding to story_purchases:', { targetUserId, targetStoryId, targetAmount });
        
        const { data: purchaseData, error: purchaseError } = await supabaseAdmin
          .from('story_purchases')
          .upsert(
            { 
              user_id: targetUserId, 
              story_id: targetStoryId, 
              amount: targetAmount,
            },
            { onConflict: 'user_id,story_id' }
          )
          .select();

        if (purchaseError) {
          console.error('❌ Error adding story purchase:', purchaseError);
          console.error('❌ Error details:', purchaseError.message, purchaseError.details);
          // Don't fail the webhook, just log it
        } else {
          console.log('✅ Story purchase added:', purchaseData);
        }
      }

      console.log('✅ Webhook processed successfully');
      return res.json({
        received: true,
        processed: true,
        type: 'story_purchase',
        story_id: targetStoryId,
        status: 'unlocked',
        transaction_id: transaction.id,
        update_result: updateData
      });
    }

    return res.json({ 
      received: true, 
      processed: false, 
      reason: 'unhandled payment type' 
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    console.error('❌ Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    });
  }
};