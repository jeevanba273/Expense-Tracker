import Stripe from 'npm:stripe@13.10.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16'
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '', 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Max-Age': '86400'
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        ...corsHeaders,
        'Allow': 'POST'
      }
    });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature found', {
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('Missing webhook secret');
    }

    // Use constructEventAsync instead of constructEvent
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userId = session.metadata?.user_id; // Get user_id from metadata

        console.log('Checkout completed:', {
          customerId,
          subscriptionId,
          sessionId: session.id,
          userId
        });

        if (!userId) {
          throw new Error('No user_id found in session metadata');
        }

        // Update user preferences to pro and store stripe IDs
        const { error: preferencesError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: userId,
            plan_tier: 'pro',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId
          })
          .select()
          .single();

        if (preferencesError) {
          console.error('Error updating preferences:', preferencesError);
          throw preferencesError;
        }

        console.log('Updated user preferences to Pro');

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

        if (orderError) {
          console.error('Error recording order:', orderError);
          throw orderError;
        }

        console.log('Added order record');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log('Subscription updated:', {
          customerId,
          subscriptionId: subscription.id,
          status: subscription.status
        });

        // Find user by stripe_customer_id
        const { data: userPrefs, error: userError } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userError) {
          console.error('Error finding user:', userError);
          throw userError;
        }

        // Update user preferences based on subscription status
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            plan_tier: subscription.status === 'active' ? 'pro' : 'free',
            stripe_subscription_id: subscription.id
          })
          .eq('user_id', userPrefs.user_id);

        if (updateError) {
          console.error('Error updating preferences:', updateError);
          throw updateError;
        }

        console.log('Updated subscription and preferences');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        console.log('Subscription deleted:', {
          customerId,
          subscriptionId: subscription.id
        });

        // Find user by stripe_customer_id
        const { data: userPrefs, error: userError } = await supabase
          .from('user_preferences')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userError) {
          console.error('Error finding user:', userError);
          throw userError;
        }

        // Update user preferences back to free plan
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            plan_tier: 'free',
            stripe_subscription_id: null
          })
          .eq('user_id', userPrefs.user_id);

        if (updateError) {
          console.error('Error updating preferences:', updateError);
          throw updateError;
        }

        console.log('Updated subscription and preferences for cancellation');
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });

  } catch (err) {
    console.error('Webhook error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});