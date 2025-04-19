import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const UserSettings: React.FC = () => {
  const { userPreferences, updateUserPreferences } = useApp();
  
  const [currency, setCurrency] = useState(userPreferences.currency);
  const [locale, setLocale] = useState(userPreferences.locale);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      updateUserPreferences({ currency, locale });
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 600);
  };
  
  const currencies = [
    { value: '₹', label: 'Indian Rupee (₹)' },
    { value: '$', label: 'US Dollar ($)' },
    { value: '€', label: 'Euro (€)' },
    { value: '£', label: 'British Pound (£)' },
  ];
  
  const locales = [
    { value: 'en-IN', label: 'English (India)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'hi-IN', label: 'Hindi (India)' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">User Settings</h2>
      
      <div className="space-y-6">
        {/* Currency Setting */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Currency</h3>
          <p className="text-gray-500 mb-4">
            Choose your preferred currency for displaying amounts.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currencies.map((curr) => (
              <button
                key={curr.value}
                onClick={() => setCurrency(curr.value)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  currency === curr.value
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block text-xl mb-1">{curr.value}</span>
                <span className="text-sm">{curr.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Locale Setting */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Display Format</h3>
          <p className="text-gray-500 mb-4">
            Choose how dates and numbers are formatted.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locales.map((loc) => (
              <button
                key={loc.value}
                onClick={() => setLocale(loc.value)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  locale === loc.value
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block font-medium mb-1">{loc.label}</span>
                <span className="text-sm">
                  {new Date().toLocaleDateString(loc.value, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Save Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              isSaving
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Save size={18} className="mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;