import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  CreditCard, 
  Lock, 
  BarChart, 
  Clock,
  Upload,
  Users,
  Loader
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { PlanTier } from '../../types';

interface PlanFeature {
  title: string;
  description: string;
  tiers: Record<PlanTier, boolean>;
  icon: React.ReactNode;
}

const SubscriptionPlans: React.FC = () => {
  const { userPreferences, refreshUserPreferences } = useApp();
  const { user, setShowAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pro' | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Check for payment completion in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      setPaymentCompleted(true);
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Refresh user preferences when component mounts, after payment completion, and periodically
  useEffect(() => {
    const checkPreferences = async () => {
      try {
        await refreshUserPreferences();
        // If preferences show pro and payment was completed, stop checking
        if (userPreferences?.plan_tier === 'pro' && paymentCompleted) {
          setPaymentCompleted(false);
        }
      } catch (error) {
        console.error('Error refreshing preferences:', error);
      }
    };
    
    checkPreferences();
    
    // If payment was completed, check more frequently for a longer period
    if (paymentCompleted) {
      const interval = setInterval(checkPreferences, 3000); // Check every 3 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setPaymentCompleted(false);
      }, 60000); // Keep checking for 60 seconds
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [paymentCompleted, userPreferences?.plan_tier]);
  
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: '₹',
      description: 'Get started with basic expense tracking',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 1,
      currency: '$',
      description: 'All features unlocked',
      priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID
    }
  ];
  
  const features: PlanFeature[] = [
    {
      title: 'Basic Dashboard',
      description: 'Simple visualizations and stats',
      tiers: { free: true, pro: true },
      icon: <BarChart size={18} />
    },
    {
      title: 'Manual Import/Export',
      description: 'CSV and JSON backup options',
      tiers: { free: true, pro: true },
      icon: <Upload size={18} />
    },
    {
      title: 'Advanced Analytics',
      description: 'Time-of-day, geo, seasonality insights',
      tiers: { free: false, pro: true },
      icon: <BarChart size={18} />
    },
    {
      title: 'Unlimited Transactions',
      description: 'No limits on transaction history',
      tiers: { free: false, pro: true },
      icon: <CreditCard size={18} />
    },
    {
      title: 'Google Drive Backup',
      description: 'Automated daily encrypted backups',
      tiers: { free: false, pro: true },
      icon: <Upload size={18} />
    },
    {
      title: 'Family Workspace',
      description: 'Shared access for up to 5 users',
      tiers: { free: false, pro: true },
      icon: <Users size={18} />
    }
  ];

  const handleSelectPlan = async (planId: 'pro') => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setSelectedPlan(planId);

    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan?.priceId) throw new Error('Invalid plan');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            userId: user.id,
            email: user.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user || !userPreferences.stripe_customer_id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            customerId: userPreferences.stripe_customer_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlanButton = (plan) => {
    // New users who haven't paid should be on free plan by default
    const currentPlanTier = userPreferences.planTier || 'free';
    const isCurrentPlan = currentPlanTier === plan.id;
    
    // If this is the user's current plan, show "Current Plan"
    if (isCurrentPlan) {
      return (
        <button 
          disabled
          className="w-full py-2 rounded-lg font-medium bg-gray-200 text-gray-600 cursor-not-allowed"
        >
          Current Plan
        </button>
      );
    }
    
    // If it's the Pro plan and user is not subscribed to it
    if (plan.id === 'pro') {
      return (
        <button 
          onClick={() => handleSelectPlan('pro')}
          disabled={loading || currentPlanTier === 'pro'}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            loading && selectedPlan === plan.id
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading && selectedPlan === plan.id ? (
            <span className="flex items-center justify-center">
              <Loader size={16} className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            'Upgrade to Pro'
          )}
        </button>
      );
    }
    
    // For free plan when user is on pro plan, just disable the button
    return (
      <button 
        disabled
        className="w-full py-2 rounded-lg font-medium bg-gray-200 text-gray-600 cursor-not-allowed"
      >
        Downgrade Not Available
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Subscription Plans</h2>
        {userPreferences.stripe_customer_id && (
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Manage Subscription
          </button>
        )}
      </div>
      <p className="text-gray-500 mb-8">
        Choose the plan that best fits your needs
      </p>
      
      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`rounded-xl border p-6 transition-all duration-300 ${
              userPreferences.planTier === plan.id 
                ? 'border-blue-400 shadow-md ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-blue-200 hover:shadow'
            }`}
          >
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">
                {plan.price === 0 ? 'Free' : `${plan.currency}${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-gray-500 ml-1">/month</span>
              )}
            </div>
            <p className="text-gray-600 mb-6">{plan.description}</p>
            
            {renderPlanButton(plan)}
          </div>
        ))}
      </div>
      
      {/* Feature Comparison */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-4 text-left text-gray-700 font-medium">Feature</th>
              {plans.map((plan) => (
                <th key={plan.id} className="py-4 px-4 text-center text-gray-700 font-medium">
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="mr-2 text-gray-500">{feature.icon}</div>
                    <div>
                      <div className="font-medium text-gray-700">{feature.title}</div>
                      <div className="text-sm text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                </td>
                
                {Object.entries(feature.tiers).map(([tier, included]) => (
                  <td key={tier} className="py-3 px-4 text-center">
                    {included ? (
                      <div className="mx-auto w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-green-600" />
                      </div>
                    ) : (
                      <div className="mx-auto w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center">
                        <X size={14} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start">
        <Lock size={20} className="text-blue-600 mr-3 flex-shrink-0" />
        <p className="text-sm text-blue-600">
          All payments are processed securely through Stripe. Your financial data is encrypted and protected.
          You can cancel or change your subscription at any time.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;