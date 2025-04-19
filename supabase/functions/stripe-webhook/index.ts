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
      console.error('Webhook Error: STRIPE_WEBHOOK_SECRET is not set');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      });
    }

    console.log('Webhook: Attempting to verify signature...');
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Webhook: Signature verified successfully');
    } catch (err) {
      console.error('Webhook: Signature verification failed:', err.message);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      });
    }

    console.log('Processing webhook event:', {
      type: event.type,
      id: event.id,
      timestamp: new Date().toISOString()
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        console.log('Webhook: Processing checkout.session.completed', {
          customerId,
          subscriptionId,
          sessionId: session.id,
          metadata: session.metadata,
          timestamp: new Date().toISOString(),
          paymentStatus: session.payment_status,
          mode: session.mode
        });

        try {
          // Get user from Supabase
          console.log('Webhook: Fetching customer data from Supabase...');
          const { data: customerData, error: customerError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('customer_id', customerId)
            .single();

          if (customerError) {
            console.error('Webhook Error: Failed to fetch customer:', {
              error: customerError,
              customerId,
              timestamp: new Date().toISOString()
            });
            throw customerError;
          }

          if (!customerData) {
            console.error('Webhook Error: No customer found:', {
              customerId,
              timestamp: new Date().toISOString()
            });
            throw new Error('Customer not found');
          }

          console.log('Webhook: Customer data found:', {
            userId: customerData.user_id,
            customerId,
            timestamp: new Date().toISOString()
          });

          // First update the subscription status
          if (subscriptionId) {
            console.log('Webhook: Updating subscription status...');
            const { error: subscriptionError } = await supabase
              .from('stripe_subscriptions')
              .upsert({
                customer_id: customerId,
                subscription_id: subscriptionId,
                status: 'active',
                current_period_start: Math.floor(Date.now() / 1000),
                current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
              });

            if (subscriptionError) {
              console.error('Webhook Error: Failed to update subscription:', {
                error: subscriptionError,
                customerId,
                subscriptionId,
                timestamp: new Date().toISOString()
              });
              throw subscriptionError;
            }

            console.log('Webhook: Subscription status updated successfully');
          }

          // Then update user preferences with a more robust upsert
          console.log('Webhook: Fetching existing preferences...');
          const { data: existingPrefs, error: fetchPrefsError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', customerData.user_id)
            .single();

          if (fetchPrefsError && fetchPrefsError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Webhook Error: Failed to fetch preferences:', {
              error: fetchPrefsError,
              userId: customerData.user_id,
              timestamp: new Date().toISOString()
            });
            throw fetchPrefsError;
          }

          const preferencesUpdate = {
            user_id: customerData.user_id,
            plan_tier: 'pro',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            ...(existingPrefs || {}) // Preserve existing preferences
          };

          console.log('Webhook: Updating user preferences with:', preferencesUpdate);

          const { error: preferencesError } = await supabase
            .from('user_preferences')
            .upsert(preferencesUpdate, {
              onConflict: 'user_id'
            });

          if (preferencesError) {
            console.error('Webhook Error: Failed to update preferences:', {
              error: preferencesError,
              userId: customerData.user_id,
              timestamp: new Date().toISOString()
            });
            throw preferencesError;
          }

          console.log('Webhook: User preferences updated successfully');

          // Add payment record
          console.log('Webhook: Recording payment...');
          const { error: paymentError } = await supabase
            .from('payment_history')
            .insert({
              user_id: customerData.user_id,
              amount: session.amount_total,
              currency: session.currency,
              status: 'succeeded',
              payment_intent_id: session.payment_intent,
              payment_method: session.payment_method_types[0],
              metadata: {
                checkout_session_id: session.id,
                subscription_id: subscriptionId
              }
            });

          if (paymentError) {
            console.error('Webhook Error: Failed to record payment:', {
              error: paymentError,
              userId: customerData.user_id,
              timestamp: new Date().toISOString()
            });
            throw paymentError;
          }

          console.log('Webhook: Payment recorded successfully');

          // Verify the update was successful
          console.log('Webhook: Final verification of updates...');
          const { data: verifyPrefs, error: verifyError } = await supabase
            .from('user_preferences')
            .select('plan_tier')
            .eq('user_id', customerData.user_id)
            .single();

          if (verifyError) {
            console.error('Webhook Error: Failed to verify preferences update:', {
              error: verifyError,
              userId: customerData.user_id,
              timestamp: new Date().toISOString()
            });
            throw verifyError;
          }

          console.log('Webhook: All updates verified successfully:', {
            planTier: verifyPrefs.plan_tier,
            userId: customerData.user_id,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          console.error('Webhook Error: Failed to process checkout completion:', {
            error,
            customerId,
            subscriptionId,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
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

        // Get user from Supabase
        const { data: customerData, error: customerError } = await supabase
          .from('stripe_customers')
          .select('user_id')
          .eq('customer_id', customerId)
          .single();

        if (customerError) {
          console.error('Error fetching customer:', customerError);
          throw customerError;
        }

        // Update subscription status
        const { error: subscriptionError } = await supabase
          .from('stripe_subscriptions')
          .upsert({
            customer_id: customerId,
            subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end
          });

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          throw subscriptionError;
        }

        // Update user preferences if subscription is active
        if (subscription.status === 'active') {
          const { error: preferencesError } = await supabase
            .from('user_preferences')
            .upsert({
              user_id: customerData.user_id,
              plan_tier: 'pro',
              stripe_subscription_id: subscription.id
            });

          if (preferencesError) {
            console.error('Error updating preferences:', preferencesError);
            throw preferencesError;
          }
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

        // Get user from Supabase
        const { data: customerData, error: customerError } = await supabase
          .from('stripe_customers')
          .select('user_id')
          .eq('customer_id', customerId)
          .single();

        if (customerError) {
          console.error('Error fetching customer:', customerError);
          throw customerError;
        }

        // Update user preferences back to free plan
        const { error: preferencesError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: customerData.user_id,
            plan_tier: 'free',
            stripe_subscription_id: null
          });

        if (preferencesError) {
          console.error('Error updating preferences:', preferencesError);
          throw preferencesError;
        }

        // Update subscription status
        const { error: subscriptionError } = await supabase
          .from('stripe_subscriptions')
          .update({
            status: 'canceled',
            deleted_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id);

        if (subscriptionError) {
          console.error('Error updating subscription:', subscriptionError);
          throw subscriptionError;
        }

        console.log('Updated subscription and preferences for cancellation');
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});