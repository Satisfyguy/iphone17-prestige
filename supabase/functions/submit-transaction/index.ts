import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubmitTxRequest {
  quoteId: string;
  txHash: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body: SubmitTxRequest = await req.json();
    console.log('Submitting transaction:', body.txHash, 'for quote:', body.quoteId);

    // Get quote from database
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('quote_id', body.quoteId)
      .eq('user_id', user.id)
      .single();

    if (quoteError || !quote) {
      console.error('Quote not found:', quoteError);
      throw new Error('Quote not found');
    }

    // Update quote with tx hash
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        tx_hash: body.txHash,
        status: 'submitted',
      })
      .eq('quote_id', body.quoteId);

    if (updateError) {
      console.error('Failed to update quote:', updateError);
      throw updateError;
    }

    // Create or update payment record
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('quote_id', body.quoteId)
      .single();

    if (existingPayment) {
      // Update existing payment
      await supabase
        .from('payments')
        .update({
          tx_hash: body.txHash,
          status: 'submitted',
          confirmations: 0,
        })
        .eq('quote_id', body.quoteId);
    } else {
      // Create new payment
      await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          quote_id: body.quoteId,
          network: quote.network,
          address: quote.address,
          expected_amount: quote.amount_usdt,
          status: 'submitted',
          tx_hash: body.txHash,
          confirmations: 0,
        });
    }

    // For demo purposes, auto-confirm after 3 seconds (in real app, this would be a webhook)
    setTimeout(async () => {
      try {
        await supabase
          .from('quotes')
          .update({ status: 'confirmed' })
          .eq('quote_id', body.quoteId);
        
        await supabase
          .from('payments')
          .update({ status: 'confirmed', confirmations: 6 })
          .eq('quote_id', body.quoteId);
        
        console.log('Auto-confirmed payment for quote:', body.quoteId);
      } catch (e) {
        console.error('Auto-confirm failed:', e);
      }
    }, 3000);

    console.log('Transaction submitted successfully');

    return new Response(
      JSON.stringify({
        status: 'submitted',
        txHash: body.txHash,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error submitting transaction:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
