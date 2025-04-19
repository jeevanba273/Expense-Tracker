/*
  # Add Stripe Fields to User Preferences

  1. Changes
    - Add stripe_customer_id to user_preferences table
    - Add stripe_subscription_id to user_preferences table
    - Add payment_history table for tracking payments

  2. Security
    - Enable RLS on payment_history table
    - Add policies for users to view their own payment history
*/

-- Add Stripe fields to user_preferences
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  payment_intent_id text,
  payment_method text,
  created_at timestamptz DEFAULT now(),
  metadata jsonb
);

-- Enable RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Add policy for payment history
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);