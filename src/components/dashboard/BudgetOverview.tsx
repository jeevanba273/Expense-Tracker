import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/helpers';

const BudgetOverview: React.FC = () => {
  const { budgets, categories, transactions, userPreferences } = useApp();
  
  // Calculate spent amount per category
  const calculateSpent = (categoryId: string) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    if (!categoryName) return 0;
    
    return transactions
      .filter(t => t.category === categoryName && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Prepare budget data with spent amounts
  const budgetData = budgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId);
    const spent = calculateSpent(budget.categoryId);
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    
    return {
      ...budget,
      categoryName: category?.name || 'Unknown',
      emoji: category?.emoji || '📝',
      color: category?.color || '#888888',
      spent,
      percentage,
      status: percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'good'
    };
  });
  
  // Sort by percentage (highest first)
  budgetData.sort((a, b) => b.percentage - a.percentage);
  
  // Only show top 3 budgets in the overview
  const topBudgets = budgetData.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Budget Overview</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          Manage Budgets
        </button>
      </div>
      
      {budgetData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No budgets set yet</p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {topBudgets.map((budget) => (
            <div key={budget.categoryId} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{budget.emoji}</span>
                  <span className="font-medium text-gray-800">{budget.categoryName}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(budget.spent, userPreferences.currency, userPreferences.locale)}
                  </span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span className="text-gray-500">
                    {formatCurrency(budget.limit, userPreferences.currency, userPreferences.locale)}
                  </span>
                </div>
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    budget.status === 'exceeded' 
                      ? 'bg-rose-500' 
                      : budget.status === 'warning' 
                        ? 'bg-amber-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className={`font-medium ${
                  budget.status === 'exceeded' 
                    ? 'text-rose-600' 
                    : budget.status === 'warning' 
                      ? 'text-amber-600' 
                      : 'text-green-600'
                }`}>
                  {budget.percentage.toFixed(0)}%
                </span>
                <span className="text-gray-500">
                  {budget.status === 'exceeded' 
                    ? `Exceeded by ${formatCurrency(budget.spent - budget.limit, userPreferences.currency, userPreferences.locale)}` 
                    : budget.status === 'warning'
                      ? 'Close to limit'
                      : 'On track'}
                </span>
              </div>
            </div>
          ))}
          
          {budgetData.length > 3 && (
            <div className="mt-2 text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                View all budgets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;