import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import SubscriptionPlans from '../components/settings/SubscriptionPlans';
import UserSettings from '../components/settings/UserSettings';
import { useApp } from '../contexts/AppContext';

const Settings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { refreshUserPreferences, user } = useApp();

  useEffect(() => {
    // Log all URL parameters
    console.log('Settings page loaded. URL parameters:', {
      success: searchParams.get('success'),
      canceled: searchParams.get('canceled'),
      fullUrl: window.location.href
    });

    const handlePaymentRedirect = async () => {
      const success = searchParams.get('success');
      if (success === 'true') {
        console.log('Payment success detected in Settings page');
        setShowSuccess(true);
        
        // Refresh preferences immediately
        try {
          console.log('Refreshing preferences after successful payment');
          await refreshUserPreferences();
          console.log('Preferences refreshed successfully');
        } catch (error) {
          console.error('Error refreshing preferences:', error);
        }
        
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      }
    };

    handlePaymentRedirect();
  }, [searchParams, refreshUserPreferences]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      
      {showSuccess && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
          <CheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-green-800 font-medium">Payment Successful!</h3>
            <p className="text-green-700 text-sm mt-1">
              Thank you for your subscription. Your Pro features are now active.
              You can view your payment history and manage your subscription at any time.
            </p>
          </div>
        </div>
      )}
      
      <UserSettings />
      <SubscriptionPlans />
      
      {/* Debug section - only visible in development */}
      {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Debug Tools</h3>
          <button
            onClick={async () => {
              console.log('Manual preference refresh triggered');
              try {
                await refreshUserPreferences();
                const response = await fetch(
                  `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_preferences?user_id=eq.${user?.id}`,
                  {
                    headers: {
                      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                    }
                  }
                );
                const data = await response.json();
                console.log('Current user preferences from API:', data);
              } catch (error) {
                console.error('Debug check failed:', error);
              }
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium text-gray-700"
          >
            Check Subscription Status
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;