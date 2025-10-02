import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const url = new URL(req.url);
    const quoteId = url.pathname.split('/').pop();

    if (!quoteId) {
      throw new Error('Quote ID is required');
    }

    console.log('Checking status for quote:', quoteId, 'User:', user.id);

    // Get quote from database
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*')
      .eq('quote_id', quoteId)
      .eq('user_id', user.id)
      .single();

    if (quoteError || !quote) {
      console.error('Quote not found:', quoteError);
      throw new Error('Quote not found');
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(quote.expires_at);
    
    if (now > expiresAt && quote.status === 'pending') {
      // Update to expired
      await supabase
        .from('quotes')
        .update({ status: 'expired' })
        .eq('quote_id', quoteId);
      
      return new Response(
        JSON.stringify({
          status: 'expired',
          txHash: quote.tx_hash,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check payment status from payments table
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('quote_id', quoteId)
      .single();

    const status = payment ? payment.status : quote.status;
    const confirmations = payment?.confirmations || 0;
    const txHash = payment?.tx_hash || quote.tx_hash;

    console.log('Status check result:', { status, confirmations, txHash });

    return new Response(
      JSON.stringify({
        status,
        confirmations,
        txHash,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error checking payment status:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
