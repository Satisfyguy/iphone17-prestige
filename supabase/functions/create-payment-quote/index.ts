import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteRequest {
  currency: string;
  amount: number;
  network: string;
  cart: Array<{
    id: string;
    color: string;
    storage: string;
    qty: number;
    price: number;
  }>;
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

    const body: QuoteRequest = await req.json();
    console.log('Creating quote for user:', user.id, 'Amount:', body.amount, body.currency);

    // Generate quote ID
    const quoteId = `Q${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Calculate USDT amount (mock rate for now, should use real rate API)
    const eurToUsdtRate = 1.08; // Mock rate
    const amountUSDT = (body.amount * eurToUsdtRate).toFixed(2);
    
    // Set expiry (15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    
    // Determine address based on network (using environment variables)
    const addresses: Record<string, string> = {
      'TRC-20': Deno.env.get('WALLET_TRC20') || 'TYour-TRON-Address-Here',
      'ERC-20': Deno.env.get('WALLET_ERC20') || '0xYour-Ethereum-Address-Here', 
      'BEP-20': Deno.env.get('WALLET_BEP20') || '0xYour-BSC-Address-Here',
    };
    
    const address = addresses[body.network] || addresses['TRC-20'];
    
    // Insert quote into database
    const { error: insertError } = await supabase
      .from('quotes')
      .insert({
        quote_id: quoteId,
        user_id: user.id,
        amount_usdt: amountUSDT,
        network: body.network,
        address: address,
        status: 'pending',
        fiat_currency: body.currency,
        fiat_amount: body.amount.toString(),
        rate: eurToUsdtRate.toString(),
        rate_provider: 'mock',
        rate_at: new Date().toISOString(),
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Quote created successfully:', quoteId);

    return new Response(
      JSON.stringify({
        quoteId,
        amountUSDT,
        network: body.network,
        address,
        expiresAt,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating quote:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
