import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import ImportExport from './pages/ImportExport';
import Settings from './pages/Settings';
import PaymentHistory from './pages/PaymentHistory';
import Auth from './pages/Auth';

const AppContent = () => {
  const { user, loading, showAuthModal, setShowAuthModal } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleProtectedAction = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  };
  
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onAuthRequired={handleProtectedAction} />;
      case 'transactions':
        return <Transactions />;
      case 'budget':
        return <Budget />;
      case 'analytics':
        return <Analytics />;
      case 'goals':
        return <Goals />;
      case 'payment-history':
        return <PaymentHistory />;
      case 'import-export':
        return <ImportExport />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onAuthRequired={handleProtectedAction} />;
    }
  };

  return (
    <AppProvider>
      <Layout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onAuthRequired={handleProtectedAction}
      >
        {renderCurrentPage()}
      </Layout>
      {showAuthModal && !user && <Auth />}
    </AppProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;