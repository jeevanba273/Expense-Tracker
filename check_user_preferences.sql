-- Check user_preferences table
select 
    up.*,
    auth.email
from user_preferences up
join auth.users auth on auth.id = up.user_id
where auth.email = 'jeevanba273@gmail.com';

-- Check stripe_user_orders
select * from stripe_user_orders
order by created_at desc
limit 5;

-- Check if customer ID is properly stored
select 
    up.user_id,
    up.plan_tier,
    up.stripe_customer_id,
    up.stripe_subscription_id,
    so.order_id,
    so.payment_status
from user_preferences up
left join stripe_user_orders so on so.user_id = up.user_id
where up.user_id in (
    select id from auth.users where email = 'jeevanba273@gmail.com'
); 