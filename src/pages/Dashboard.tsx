import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import QuickStats from '../components/dashboard/QuickStats';
import TransactionList from '../components/dashboard/TransactionList';
import BudgetOverview from '../components/dashboard/BudgetOverview';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import SpendingTrend from '../components/dashboard/SpendingTrend';
import AddTransaction from '../components/transaction/AddTransaction';

interface DashboardProps {
  onAuthRequired: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAuthRequired }) => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const { user } = useAuth();

  const handleAddTransaction = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setShowAddTransaction(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleAddTransaction}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-1" />
          Add Transaction
        </button>
      </div>
      
      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <SpendingTrend />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionList 
          showAddButton 
          onAddClick={handleAddTransaction}
        />
        <BudgetOverview />
      </div>
      
      {user && (
        <AddTransaction 
          isOpen={showAddTransaction} 
          onClose={() => setShowAddTransaction(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;