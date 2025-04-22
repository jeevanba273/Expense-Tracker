import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'npm:stripe@13.10.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId, userId, email } = await req.json();

    console.log('Creating checkout session with:', {
      priceId,
      userId,
      email
    });

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({ email });
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log('Updating existing customer:', customer.id);
      // Update customer metadata
      await stripe.customers.update(customer.id, {
        metadata: { user_id: userId }
      });
    } else {
      console.log('Creating new customer');
      customer = await stripe.customers.create({
        email,
        metadata: { user_id: userId }
      });
    }

    console.log('Customer:', {
      id: customer.id,
      email: customer.email,
      metadata: customer.metadata
    });

    // Create checkout session
    const sessionData = {
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/settings?success=true`,
      cancel_url: `${req.headers.get('origin')}/settings?canceled=true`,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      metadata: {
        user_id: userId  // Add user_id to session metadata
      }
    };

    console.log('Creating session with:', sessionData);
    
    const session = await stripe.checkout.sessions.create(sessionData);

    console.log('Session created:', {
      id: session.id,
      metadata: session.metadata
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Checkout error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});