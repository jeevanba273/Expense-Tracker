/*
  # Schema Update with Safety Checks
  
  This migration creates the core tables if they don't exist yet:
  - transactions
  - categories
  - budgets
  - user_preferences
  
  Each table creation is guarded with IF NOT EXISTS to prevent errors
  if the tables were already created by a previous migration.
*/

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  merchant text NOT NULL,
  note text,
  date date NOT NULL,
  is_recurring boolean DEFAULT false,
  type text NOT NULL CHECK (type IN ('expense', 'income')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table if it doesn't exist
CREATE TABLE IF NOT EXISTS budgets (
  category_id uuid PRIMARY KEY REFERENCES categories,
  user_id uuid REFERENCES auth.users NOT NULL,
  budget_limit numeric NOT NULL,
  spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  currency text DEFAULT '₹',
  locale text DEFAULT 'en-IN',
  plan_tier text DEFAULT 'free' CHECK (plan_tier IN ('free', 'plus', 'pro')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', 'transactions');
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', 'categories');
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', 'budgets');
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', 'user_preferences');
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can manage their own transactions'
  ) THEN
    CREATE POLICY "Users can manage their own transactions"
      ON transactions
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Users can manage their own categories'
  ) THEN
    CREATE POLICY "Users can manage their own categories"
      ON categories
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'budgets' AND policyname = 'Users can manage their own budgets'
  ) THEN
    CREATE POLICY "Users can manage their own budgets"
      ON budgets
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_preferences' AND policyname = 'Users can manage their own preferences'
  ) THEN
    CREATE POLICY "Users can manage their own preferences"
      ON user_preferences
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;