import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Repeat, 
  CreditCard, 
  Receipt,
  Save,
  Plus,
  Crown,
  AlertCircle,
  Search
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/helpers';
import { Transaction } from '../../types';

// Comprehensive emoji list categorized
const emojiCategories = {
  'Money & Shopping': ['💰', '💵', '💳', '🛍️', '🛒', '🏪', '🏬', '💸', '🪙', '💎'],
  'Food & Drinks': ['🍕', '🍔', '🍟', '🌮', '🥗', '🍱', '🍜', '🍝', '🍖', '🍗', '🥩', '🥪', '☕', '🍺', '🍷', '🥤'],
  'Transport': ['🚗', '🚕', '🚌', '🚇', '✈️', '🚅', '🛵', '🚲', '⛽', '🚦'],
  'Home & Utilities': ['🏠', '💡', '🪑', '🛋️', '🛁', '🚿', '🧹', '📺', '🪴', '🏡'],
  'Entertainment': ['🎬', '🎮', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎫', '🎼', '🎧'],
  'Health': ['💊', '🏥', '🩺', '🦷', '👓', '🧘', '🏃', '💪', '🧠', '❤️'],
  'Education': ['📚', '✏️', '🎓', '💻', '📝', '📖', '🎒', '🔬', '🔭', '📐'],
  'Bills & Services': ['📱', '💻', '📺', '📡', '🔌', '🪫', '📨', '📬', '📃', '✉️'],
  'Income': ['💼', '💰', '💵', '🏦', '📈', '💹', '🤝', '📊', '💸', '🏭'],
  'Savings': ['🏦', '💎', '🔐', '💱', '📊', '💰', '🏧', '💳', '💵', '🪙'],
  'General': ['📌', '📍', '⭐', '🔖', '📝', '📎', '🔗', '📋', '📁', '🗂️']
};

interface AddTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ 
  isOpen, 
  onClose,
  editingTransaction 
}) => {
  const { 
    categories, 
    addTransaction, 
    updateTransaction,
    addCategory, 
    userPreferences, 
    isFeatureAvailable 
  } = useApp();
  
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [showKeypad, setShowKeypad] = useState<boolean>(true);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState<string>('📝');
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [emojiSearch, setEmojiSearch] = useState<string>('');
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState<string>('Money & Shopping');

  // Reset form when opening or when editingTransaction changes
  useEffect(() => {
    if (isOpen) {
      if (editingTransaction) {
        setAmount(editingTransaction.amount.toString());
        setType(editingTransaction.type);
        setCategory(editingTransaction.category);
        setMerchant(editingTransaction.merchant);
        setNote(editingTransaction.note || '');
        setDate(editingTransaction.date);
        setIsRecurring(editingTransaction.isRecurring);
      } else {
        setAmount('');
        setType('expense');
        setCategory('');
        setMerchant('');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
        setIsRecurring(false);
      }
      setShowKeypad(true);
      setSubmitSuccess(false);
      setShowNewCategoryModal(false);
      setNewCategoryName('');
      setNewCategoryEmoji('📝');
      setShowUpgradeModal(false);
      setEmojiSearch('');
      setSelectedEmojiCategory('Money & Shopping');
    }
  }, [isOpen, editingTransaction]);

  const handleKeypadPress = (key: string) => {
    if (key === 'backspace') {
      setAmount(prev => prev.slice(0, -1));
      return;
    }
    
    if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(prev => prev + key);
      }
      return;
    }
    
    const parts = amount.split('.');
    if (parts.length > 1 && parts[1].length >= 2) {
      return;
    }
    
    setAmount(prev => prev + key);
  };

  const handleSubmit = () => {
    if (!amount || !category || !merchant) return;
    
    const transactionData = {
      amount: parseFloat(amount),
      category,
      merchant,
      note,
      date,
      isRecurring,
      type
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    setSubmitSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const filteredCategories = categories
    .filter(c => type === 'expense' ? c.name !== 'Salary' : c.name === 'Salary')
    .filter((cat, index, self) => 
      index === self.findIndex((c) => c.name === cat.name)
    );

  const handleNewCategory = () => {
    if (!isFeatureAvailable('customCategories')) {
      setShowUpgradeModal(true);
      return;
    }
    setShowNewCategoryModal(true);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName || !newCategoryEmoji) return;
    
    addCategory({
      name: newCategoryName,
      emoji: newCategoryEmoji,
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });
    
    setCategory(newCategoryName);
    setShowNewCategoryModal(false);
    setNewCategoryName('');
    setNewCategoryEmoji('📝');
  };

  const renderEmojiPicker = () => {
    const allEmojis = Object.values(emojiCategories).flat();
    const filteredEmojis = emojiSearch
      ? allEmojis.filter(emoji => emoji.includes(emojiSearch))
      : emojiCategories[selectedEmojiCategory];

    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={emojiSearch}
            onChange={(e) => setEmojiSearch(e.target.value)}
            placeholder="Search emojis..."
            className="bg-transparent border-none focus:outline-none flex-1 text-sm"
          />
        </div>

        {!emojiSearch && (
          <div className="flex overflow-x-auto py-2 space-x-2 scrollbar-thin scrollbar-thumb-gray-200">
            {Object.keys(emojiCategories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedEmojiCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedEmojiCategory === category
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => setNewCategoryEmoji(emoji)}
              className={`p-2 text-xl rounded hover:bg-gray-100 ${
                newCategoryEmoji === emoji ? 'bg-blue-100' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Transaction Form */}
      <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-xl z-50 shadow-xl transform transition-transform duration-300 ease-in-out max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {submitSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Save size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Transaction Saved!</h3>
            <p className="text-gray-500 text-center">
              Your transaction has been successfully {editingTransaction ? 'updated' : 'recorded'}.
            </p>
          </div>
        ) : (
          <>
            {/* Amount Input */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setType('expense')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      type === 'expense' 
                        ? 'bg-rose-100 text-rose-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setType('income')}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Income
                  </button>
                </div>
                <button
                  onClick={() => setShowKeypad(!showKeypad)}
                  className="text-blue-600 text-sm"
                >
                  {showKeypad ? 'Hide Keypad' : 'Show Keypad'}
                </button>
              </div>
              
              <div className="flex items-center justify-center py-4">
                <div className="text-4xl font-bold text-center" style={{ minHeight: '3rem' }}>
                  {amount ? (
                    <span className={type === 'expense' ? 'text-rose-600' : 'text-green-600'}>
                      {userPreferences.currency} {amount}
                    </span>
                  ) : (
                    <span className="text-gray-300">
                      {userPreferences.currency} 0
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Keypad */}
            {showKeypad && (
              <div className="grid grid-cols-3 gap-1 p-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeypadPress(key)}
                    className={`p-4 text-center rounded-lg transition-colors ${
                      key === 'backspace'
                        ? 'bg-gray-100 text-gray-700 flex items-center justify-center'
                        : 'bg-white border border-gray-100 hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    {key === 'backspace' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                        <line x1="18" y1="9" x2="12" y2="15"></line>
                        <line x1="12" y1="9" x2="18" y2="15"></line>
                      </svg>
                    ) : (
                      key
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Transaction Details */}
            <div className="p-4 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.name)}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                        category === cat.name
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl mb-1">{cat.emoji}</span>
                      <span className="text-xs text-gray-700">{cat.name}</span>
                    </button>
                  ))}
                  
                  <button
                    onClick={handleNewCategory}
                    className="p-3 rounded-lg border flex flex-col items-center justify-center transition-colors bg-blue-50 border-blue-200 hover:bg-blue-100"
                  >
                    <span className="text-2xl mb-1">
                      <Plus size={24} className="text-blue-600" />
                    </span>
                    <span className="text-xs text-blue-600">Add New</span>
                  </button>
                </div>
              </div>
              
              {/* Merchant */}
              <div>
                <label htmlFor="merchant" className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant / Payee
                </label>
                <input
                  type="text"
                  id="merchant"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="Where did you spend?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Note */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Date and Recurring */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recurring
                  </label>
                  <button
                    onClick={() => setIsRecurring(!isRecurring)}
                    className={`w-full px-3 py-2 border rounded-lg flex items-center justify-center transition-colors ${
                      isRecurring
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700'
                    }`}
                  >
                    <Repeat size={18} className="mr-2" />
                    <span>{isRecurring ? 'Yes' : 'No'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!amount || !category || !merchant}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-white ${
                    !amount || !category || !merchant
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Category Modal */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Custom Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose Emoji
                </label>
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-3 border-b border-gray-100 flex items-center space-x-2">
                    <span className="text-2xl">{newCategoryEmoji}</span>
                    <span className="text-sm text-gray-600">Selected Emoji</span>
                  </div>
                  {renderEmojiPicker()}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNewCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Create Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={32} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pro Feature</h3>
              <p className="text-gray-600 mb-6">
                Custom categories are available exclusively to Pro users. Upgrade your account to create unlimited custom categories.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    // Navigate to upgrade page or show upgrade modal
                  }}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTransaction;