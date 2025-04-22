import Stripe from 'npm:stripe@13.10.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook Error: No signature found in request headers');
    return new Response('No signature found', { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const userId = session.metadata?.user_id;

        if (!userId || !customerId) {
          throw new Error('Missing user_id or customer_id in session');
        }

        // Update user preferences with pro plan and stripe customer id
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: userId,
            plan_tier: 'pro',
            stripe_customer_id: customerId
          });

        if (prefsError) throw prefsError;

        // Record the order
        const { error: orderError } = await supabase
          .from('stripe_user_orders')
          .insert({
            user_id: userId,
            order_id: session.id,
            payment_intent_id: session.payment_intent,
            amount_total: session.amount_total,
            payment_status: session.payment_status,
            order_date: new Date().toISOString()
          });

        if (orderError) throw orderError;
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Get user preferences with this stripe_customer_id
        const { data: userPrefs, error: prefsError } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (prefsError) throw prefsError;

        // Update plan tier based on subscription status
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            plan_tier: subscription.status === 'active' ? 'pro' : 'free'
          })
          .eq('user_id', userPrefs.user_id);

        if (updateError) throw updateError;
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});