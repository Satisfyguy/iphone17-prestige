import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateOrderRequest {
  quoteId: string;
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

    const body: CreateOrderRequest = await req.json();
    console.log('Creating order for quote:', body.quoteId, 'User:', user.id);

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

    // Verify quote is confirmed
    if (quote.status !== 'confirmed') {
      throw new Error('Quote must be confirmed before creating order');
    }

    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        user_id: user.id,
        quote_id: body.quoteId,
        total_usdt: quote.amount_usdt,
        status: 'confirmed',
      });

    if (orderError) {
      console.error('Failed to create order:', orderError);
      throw orderError;
    }

    console.log('Order created successfully:', orderId);

    return new Response(
      JSON.stringify({
        orderId,
        status: 'confirmed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
