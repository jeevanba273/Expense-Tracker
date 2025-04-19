import React, { useState } from 'react';
import { Edit2, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';

const Budget: React.FC = () => {
  const { 
    categories, 
    budgets, 
    transactions, 
    updateBudget,
    userPreferences 
  } = useApp();
  
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  
  const calculateSpent = (categoryId: string) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    if (!categoryName) return 0;
    
    return transactions
      .filter(t => t.category === categoryName && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  const getBudgetForCategory = (categoryId: string) => {
    return budgets.find(b => b.categoryId === categoryId);
  };
  
  const startEdit = (categoryId: string) => {
    const budget = getBudgetForCategory(categoryId);
    setBudgetAmount(budget ? budget.limit.toString() : '');
    setEditingCategoryId(categoryId);
  };
  
  const cancelEdit = () => {
    setEditingCategoryId(null);
    setBudgetAmount('');
  };
  
  const saveBudget = () => {
    if (editingCategoryId && budgetAmount) {
      updateBudget(editingCategoryId, parseFloat(budgetAmount));
      setEditingCategoryId(null);
      setBudgetAmount('');
    }
  };
  
  const removeBudget = (categoryId: string) => {
    updateBudget(categoryId, 0);
  };
  
  // Filter out income categories like "Salary"
  const expenseCategories = categories.filter(c => c.name !== 'Salary');
  
  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = expenseCategories.reduce((sum, category) => {
    return sum + calculateSpent(category.id);
  }, 0);
  
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Budget</h1>
      </div>
      
      {/* Budget Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-700 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(totalBudget, userPreferences.currency, userPreferences.locale)}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-1">Total Spent</p>
            <p className={`text-2xl font-bold ${totalSpent > totalBudget ? 'text-rose-600' : 'text-gray-800'}`}>
              {formatCurrency(totalSpent, userPreferences.currency, userPreferences.locale)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Overall Budget Usage</span>
            <span className={`text-sm font-medium ${
              totalPercentage > 100 
                ? 'text-rose-600' 
                : totalPercentage > 80 
                  ? 'text-amber-600' 
                  : 'text-green-600'
            }`}>
              {totalPercentage.toFixed(0)}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                totalPercentage > 100 
                  ? 'bg-rose-500' 
                  : totalPercentage > 80 
                    ? 'bg-amber-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(totalPercentage, 100)}%` }}
            ></div>
          </div>
          
          {totalPercentage > 100 && (
            <div className="flex items-center mt-2 text-sm text-rose-600">
              <AlertTriangle size={16} className="mr-1" />
              <span>You've exceeded your total budget by {formatCurrency(totalSpent - totalBudget, userPreferences.currency, userPreferences.locale)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Category Budgets */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Category Budgets</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {expenseCategories.map((category) => {
            const budget = getBudgetForCategory(category.id);
            const spent = calculateSpent(category.id);
            const percentage = budget?.limit ? (spent / budget.limit) * 100 : 0;
            const status = 
              percentage > 100 ? 'exceeded' : 
              percentage > 80 ? 'warning' : 
              'good';
              
            return (
              <div key={category.id} className="p-4">
                {editingCategoryId === category.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{category.emoji}</span>
                      <span className="font-medium text-gray-800">{category.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Budget Limit:</span>
                      <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          {userPreferences.currency}
                        </span>
                        <input
                          type="number"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter amount"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={saveBudget}
                        disabled={!budgetAmount}
                        className={`px-4 py-2 rounded-lg text-white font-medium ${
                          !budgetAmount
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{category.emoji}</span>
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {budget?.limit ? (
                          <>
                            <button
                              onClick={() => startEdit(category.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              aria-label="Edit budget"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => removeBudget(category.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                              aria-label="Remove budget"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(category.id)}
                            className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                          >
                            <Plus size={16} className="mr-1" />
                            Set Budget
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {budget?.limit ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Spent: {formatCurrency(spent, userPreferences.currency, userPreferences.locale)}
                          </span>
                          <span className="text-gray-600">
                            Budget: {formatCurrency(budget.limit, userPreferences.currency, userPreferences.locale)}
                          </span>
                        </div>
                        
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              status === 'exceeded' 
                                ? 'bg-rose-500' 
                                : status === 'warning' 
                                  ? 'bg-amber-500' 
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className={`font-medium ${
                            status === 'exceeded' 
                              ? 'text-rose-600' 
                              : status === 'warning' 
                                ? 'text-amber-600' 
                                : 'text-green-600'
                          }`}>
                            {percentage.toFixed(0)}%
                          </span>
                          
                          {status === 'exceeded' && (
                            <span className="text-rose-600">
                              Exceeded by {formatCurrency(spent - budget.limit, userPreferences.currency, userPreferences.locale)}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Spent: {formatCurrency(spent, userPreferences.currency, userPreferences.locale)} (No budget set)
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budget;