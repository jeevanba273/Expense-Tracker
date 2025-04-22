-- First drop the existing view
drop view if exists public.stripe_user_orders;

-- Create stripe_user_orders table
create table if not exists public.stripe_user_orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    order_id text not null,
    payment_intent_id text,
    amount_total bigint,
    payment_status text,
    order_date timestamp with time zone default timezone('utc'::text, now()),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up RLS (Row Level Security)
alter table public.stripe_user_orders enable row level security;

-- Create policies
create policy "Users can view their own orders"
    on public.stripe_user_orders for select
    using (auth.uid() = user_id);

-- Create indexes
create index stripe_user_orders_user_id_idx on public.stripe_user_orders(user_id);
create index stripe_user_orders_order_id_idx on public.stripe_user_orders(order_id);

-- Set up realtime
alter publication supabase_realtime add table stripe_user_orders; 