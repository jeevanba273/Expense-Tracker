import React, { useState } from 'react';
import { ChevronRight, Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import AddTransaction from '../transaction/AddTransaction';

interface TransactionListProps {
  limit?: number;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  limit = 5,
  showAddButton = false,
  onAddClick
}) => {
  const { transactions, categories, userPreferences, removeTransaction } = useApp();
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);
  
  // Sort transactions by date (newest first) and limit them
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
    
  const getCategoryEmoji = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.emoji : '📝';
  };

  const handleDelete = async (id: string) => {
    await removeTransaction(id);
    setShowDeleteConfirm(null);
  };

  const renderDetailsModal = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Transaction Details</h3>
            <button
              onClick={() => setShowDetailsModal(null)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">{getCategoryEmoji(transaction.category)}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{transaction.merchant}</h4>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'expense' ? 'text-rose-600' : 'text-green-600'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount, userPreferences.currency, userPreferences.locale)}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Date</span>
                <p className="font-medium text-gray-800">
                  {formatDate(transaction.date, userPreferences.locale)}
                </p>
              </div>
              
              {transaction.note && (
                <div>
                  <span className="text-sm text-gray-500">Note</span>
                  <p className="font-medium text-gray-800">{transaction.note}</p>
                </div>
              )}
              
              <div>
                <span className="text-sm text-gray-500">Recurring</span>
                <p className="font-medium text-gray-800">
                  {transaction.isRecurring ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  setShowDetailsModal(null);
                  setShowEditModal(transaction.id);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Edit Transaction
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(null);
                  setShowDeleteConfirm(transaction.id);
                }}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
              >
                Delete Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmation = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Delete Transaction</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(transactionId)}
              className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
        
        <div className="flex items-center space-x-2">
          {showAddButton && (
            <button 
              onClick={onAddClick}
              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Plus size={18} />
            </button>
          )}
          
          <button className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>
      
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions yet</p>
          <button 
            onClick={onAddClick}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Add your first transaction
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div 
                className="flex items-center space-x-3 flex-grow cursor-pointer"
                onClick={() => setShowDetailsModal(transaction.id)}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                  <span className="text-lg">{getCategoryEmoji(transaction.category)}</span>
                </div>
                
                <div>
                  <p className="font-medium text-gray-800">{transaction.merchant}</p>
                  <div className="flex text-sm text-gray-500">
                    <span>{transaction.category}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(transaction.date, userPreferences.locale)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${
                  transaction.type === 'expense' ? 'text-rose-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount, userPreferences.currency, userPreferences.locale)}
                </span>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                  <button
                    onClick={() => setShowEditModal(transaction.id)}
                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(transaction.id)}
                    className="p-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {transactions.length > limit && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View all transactions
          </button>
        </div>
      )}

      {showDetailsModal && renderDetailsModal(showDetailsModal)}
      {showDeleteConfirm && renderDeleteConfirmation(showDeleteConfirm)}
      {showEditModal && (
        <AddTransaction 
          isOpen={true} 
          onClose={() => setShowEditModal(null)}
          editingTransaction={transactions.find(t => t.id === showEditModal)}
        />
      )}
    </div>
  );
};

export default TransactionList;