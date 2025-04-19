import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import SubscriptionPlans from '../components/settings/SubscriptionPlans';
import UserSettings from '../components/settings/UserSettings';

const Settings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = React.useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

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
    </div>
  );
};

export default Settings;