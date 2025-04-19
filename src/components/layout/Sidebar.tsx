import React from 'react';
import { 
  Home, 
  BarChart3,
  Calendar, 
  Settings, 
  Upload,
  CreditCard,
  User,
  X,
  Crown,
  Target,
  Receipt,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onCollapse: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  isCollapsed,
  onClose, 
  onCollapse,
  onNavigate,
  currentPage
}) => {
  const { userPreferences, isFeatureAvailable } = useApp();
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Calendar size={20} /> },
    { id: 'budget', label: 'Budget', icon: <CreditCard size={20} /> },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 size={20} />, 
      requiresPro: true,
      upgrade: userPreferences?.planTier !== 'pro'
    },
    { 
      id: 'goals', 
      label: 'Goals & Forecasts', 
      icon: <Target size={20} />, 
      requiresPro: true,
      upgrade: userPreferences?.planTier !== 'pro'
    },
    { id: 'payment-history', label: 'Payment History', icon: <Receipt size={20} /> },
    { id: 'import-export', label: 'Import & Export', icon: <Upload size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Get user's display name or email username
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name ||
                     user?.email?.split('@')[0] || 
                     'User';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className={`px-4 py-6 border-b border-gray-100 flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Zero-Import</h2>
                  <p className="text-xs text-gray-500">Expense Tracker</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              {!isCollapsed && (
                <button 
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={onCollapse}
                className="hidden lg:block p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>
          </div>
          
          {/* Navigation items */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isDisabled = item.requiresPro && !isFeatureAvailable('advancedAnalytics');
                
                return (
                  <li key={item.id} className="relative group">
                    <button
                      onClick={() => {
                        if (!isDisabled) {
                          onNavigate(item.id);
                          onClose();
                        }
                      }}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} 
                        px-4 py-3 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : isDisabled 
                            ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={isDisabled}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0">{item.icon}</span>
                        {!isCollapsed && <span className="flex-1">{item.label}</span>}
                      </div>
                      {!isCollapsed && item.upgrade && (
                        <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                          <Crown size={12} className="text-amber-500" />
                        </span>
                      )}

                      {/* Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
                          <div className="relative flex items-center">
                            <div className="absolute -left-1 top-1/2 -mt-1 border-4 border-transparent border-r-gray-900"></div>
                            {item.label}
                            {item.upgrade && (
                              <span className="ml-1">
                                <Crown size={12} className="text-amber-300 inline" />
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* User info at bottom */}
          {!isCollapsed && user && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-500">
                    {userPreferences?.planTier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;