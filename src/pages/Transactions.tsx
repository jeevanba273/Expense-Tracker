import React, { useState } from 'react';
import { Filter, Calendar, Plus, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import AddTransaction from '../components/transaction/AddTransaction';

const Transactions: React.FC = () => {
  const { transactions, categories, userPreferences } = useApp();
  
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const getCategoryEmoji = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.emoji : '📝';
  };
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Search by merchant or note
      const searchMatch = 
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (transaction.note && transaction.note.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by category
      const categoryMatch = selectedCategory ? transaction.category === selectedCategory : true;
      
      // Filter by type
      const typeMatch = selectedType ? transaction.type === selectedType : true;
      
      return searchMatch && categoryMatch && typeMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-1" />
          Add Transaction
        </button>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="text-gray-500 mb-4">
            No transactions found
          </div>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} className="mr-1" />
            Add your first transaction
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr,1fr,auto] md:grid-cols-[auto,1fr,1fr,auto] gap-4 p-4 border-b border-gray-100 bg-gray-50">
            <button
              onClick={() => toggleSort('date')}
              className="flex items-center space-x-1 text-sm font-medium text-gray-700"
            >
              <Calendar size={16} />
              <span>Date</span>
              {sortBy === 'date' && (
                <span>{sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</span>
              )}
            </button>
            
            <div className="hidden md:block text-sm font-medium text-gray-700">Category</div>
            
            <div className="text-sm font-medium text-gray-700">Description</div>
            
            <button
              onClick={() => toggleSort('amount')}
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 justify-self-end"
            >
              <span>Amount</span>
              {sortBy === 'amount' && (
                <span>{sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</span>
              )}
            </button>
          </div>
          
          {/* Transaction Rows */}
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="grid grid-cols-[1fr,1fr,auto] md:grid-cols-[auto,1fr,1fr,auto] gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-600">
                  {formatDate(transaction.date, userPreferences.locale)}
                </div>
                
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-lg">{getCategoryEmoji(transaction.category)}</span>
                  <span className="text-gray-700">{transaction.category}</span>
                </div>
                
                <div>
                  <div className="font-medium text-gray-800">{transaction.merchant}</div>
                  {transaction.note && (
                    <div className="text-sm text-gray-500 mt-1">{transaction.note}</div>
                  )}
                </div>
                
                <div className={`justify-self-end font-semibold ${
                  transaction.type === 'expense' ? 'text-rose-600' : 'text-green-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount, userPreferences.currency, userPreferences.locale)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <AddTransaction 
        isOpen={showAddTransaction} 
        onClose={() => setShowAddTransaction(false)} 
      />
    </div>
  );
};

export default Transactions;