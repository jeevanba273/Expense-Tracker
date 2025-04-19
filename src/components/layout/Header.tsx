import React, { useState, useEffect } from 'react';
import { Menu, X, UserCircle, LogOut, LogIn } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { userPreferences } = useApp();
  const { user, signOut, setShowAuthModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 60000); // Update time every minute

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  // Format date for display
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(dateTime);

  // Format time for display
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(dateTime);

  const getPlanLabel = () => {
    switch (userPreferences?.planTier) {
      case 'plus':
        return <span className="text-amber-500 font-semibold">PLUS</span>;
      case 'pro':
        return <span className="text-indigo-500 font-semibold">PRO</span>;
      default:
        return <span className="text-gray-500 font-semibold">FREE</span>;
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
        scrolled 
          ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onMenuToggle} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">
              Zero-Import <span className="text-blue-600">Expense Tracker</span>
            </h1>
            <div className="flex items-center text-xs text-gray-500">
              {formattedDate} · {formattedTime} {user && `· ${getPlanLabel()}`}
            </div>
          </div>
        </div>
        
        <div className="relative">
          {user ? (
            <button 
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <UserCircle size={24} />
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogIn size={18} className="mr-2" />
              Sign In
            </button>
          )}

          {showUserMenu && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
                <p className="text-xs text-gray-500">{userPreferences?.planTier?.toUpperCase() || 'FREE'}</p>
              </div>
              <button
                onClick={signOut}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;