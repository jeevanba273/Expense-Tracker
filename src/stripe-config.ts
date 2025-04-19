export const STRIPE_PRODUCTS = {
  PRO_SUBSCRIPTION: {
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    name: 'Pro Plan',
    description: 'All features unlocked',
    mode: 'subscription' as const
  }
} as const;