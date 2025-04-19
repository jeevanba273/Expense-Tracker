import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Crown,
  Save,
  X,
  Clock
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

interface ExpenseForecast {
  weeklyExpense: number;
  monthlyExpense: number;
  yearlyExpense: number;
  weeklyTrend: number;
  monthlyTrend: number;
  yearlyTrend: number;
}

const Goals: React.FC = () => {
  const { 
    transactions, 
    categories,
    userPreferences, 
    isFeatureAvailable 
  } = useApp();
  
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    priority: 'medium'
  });

  // Calculate expense forecasts based on current spending patterns
  const calculateExpenseForecast = (): ExpenseForecast => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

    // Get recent expenses
    const weeklyExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        new Date(t.date) >= oneWeekAgo
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        new Date(t.date) >= oneMonthAgo
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const threeMonthExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        new Date(t.date) >= threeMonthsAgo
      )
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate daily averages
    const dailyAvgWeek = weeklyExpenses / 7;
    const dailyAvgMonth = monthlyExpenses / 30;
    const dailyAvgQuarter = threeMonthExpenses / 90;

    // Project future expenses
    const weeklyForecast = dailyAvgWeek * 7;
    const monthlyForecast = dailyAvgMonth * 30;
    const yearlyForecast = dailyAvgQuarter * 365;

    // Calculate trends (percentage change)
    const weeklyTrend = ((dailyAvgWeek - dailyAvgMonth) / dailyAvgMonth) * 100;
    const monthlyTrend = ((dailyAvgMonth - dailyAvgQuarter) / dailyAvgQuarter) * 100;
    const yearlyTrend = monthlyTrend; // Use monthly trend for yearly projection

    return {
      weeklyExpense: weeklyForecast,
      monthlyExpense: monthlyForecast,
      yearlyExpense: yearlyForecast,
      weeklyTrend,
      monthlyTrend,
      yearlyTrend
    };
  };

  // Calculate real financial metrics
  const calculateFinancialMetrics = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Current month transactions
    const currentMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= monthStart
    );

    // Last month transactions
    const lastMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= lastMonthStart && new Date(t.date) < monthStart
    );

    // Calculate monthly income and expenses
    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate average monthly savings
    const savingsPotential = monthlyIncome - monthlyExpenses;

    // Calculate spending patterns
    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Identify risk factors
    const riskFactors = [];
    
    // Check if expenses exceed 80% of income
    if (monthlyExpenses > monthlyIncome * 0.8) {
      riskFactors.push('High expense to income ratio');
    }

    // Check for large recurring expenses
    const recurringTransactions = transactions.filter(t => t.isRecurring);
    const recurringTotal = recurringTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (recurringTotal > monthlyIncome * 0.5) {
      riskFactors.push('High recurring expenses');
    }

    // Check for irregular large expenses
    const largeExpenses = transactions.filter(t => 
      t.type === 'expense' && t.amount > monthlyIncome * 0.2
    );
    if (largeExpenses.length > 0) {
      riskFactors.push('Irregular large expenses detected');
    }

    // Identify savings opportunities
    const opportunities = [];

    // Check for potential subscription optimizations
    const subscriptionCategories = ['Entertainment', 'Streaming', 'Subscriptions'];
    const subscriptionExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        subscriptionCategories.some(cat => t.category.toLowerCase().includes(cat.toLowerCase()))
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (subscriptionExpenses > monthlyIncome * 0.1) {
      opportunities.push('Potential to optimize subscription services');
    }

    // Check for dining out expenses
    const diningExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category.toLowerCase().includes('food')
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (diningExpenses > monthlyIncome * 0.15) {
      opportunities.push('Consider reducing dining out expenses');
    }

    // Check for shopping patterns
    const shoppingExpenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category.toLowerCase().includes('shopping')
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (shoppingExpenses > monthlyIncome * 0.2) {
      opportunities.push('Review discretionary shopping expenses');
    }

    return {
      monthlyIncome,
      monthlyExpenses,
      savingsPotential,
      spendingByCategory,
      riskFactors,
      opportunities,
      timeToGoal: Math.ceil(50000 / (savingsPotential > 0 ? savingsPotential : 1))
    };
  };

  const forecastData = calculateFinancialMetrics();
  const expenseForecast = calculateExpenseForecast();

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('financial-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage when updated
  useEffect(() => {
    localStorage.setItem('financial-goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline || !newGoal.category) return;

    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category,
      priority: newGoal.priority as 'low' | 'medium' | 'high'
    };

    setGoals([...goals, goal]);
    setNewGoal({ priority: 'medium' });
    setShowNewGoalModal(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const renderNewGoalModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Create New Goal</h3>
            <button
              onClick={() => setShowNewGoalModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                value={newGoal.name || ''}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Emergency Fund"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {userPreferences.currency}
                </span>
                <input
                  type="number"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={newGoal.deadline || ''}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newGoal.category || ''}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setNewGoal({ ...newGoal, priority: priority as 'low' | 'medium' | 'high' })}
                    className={`flex-1 px-4 py-2 rounded-lg capitalize ${
                      newGoal.priority === priority
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.deadline || !newGoal.category}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isFeatureAvailable('goalSimulator')) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Goals & Forecasts</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <Crown size={28} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Pro Feature</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Upgrade to Pro to unlock our powerful goal-setting and AI-powered forecasting features. 
            Plan your financial future with confidence.
          </p>
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
          >
            Upgrade to Pro
          </button>
        </div>

        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="text-center">
                <Crown size={40} className="mx-auto text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Upgrade to Pro
                </h3>
                <p className="text-gray-600 mb-6">
                  Get access to advanced features including:
                  <ul className="text-left mt-4 space-y-2">
                    <li className="flex items-center">
                      <ChevronRight size={16} className="text-amber-600 mr-2" />
                      AI-powered financial forecasting
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={16} className="text-amber-600 mr-2" />
                      Unlimited savings goals
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={16} className="text-amber-600 mr-2" />
                      Smart goal recommendations
                    </li>
                    <li className="flex items-center">
                      <ChevronRight size={16} className="text-amber-600 mr-2" />
                      Progress notifications
                    </li>
                  </ul>
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Goals & Forecasts</h1>
        <button
          onClick={() => setShowNewGoalModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-1" />
          Add Goal
        </button>
      </div>

      {/* Expense Forecast */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <Clock size={24} className="text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Expense Forecast</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800 mb-2">End of Week</h3>
            <div className="text-2xl font-bold text-purple-900 mb-2">
              {formatCurrency(expenseForecast.weeklyExpense, userPreferences.currency, userPreferences.locale)}
            </div>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${
                expenseForecast.weeklyTrend > 0 ? 'text-rose-600' : 'text-green-600'
              }`}>
                {expenseForecast.weeklyTrend > 0 ? '↑' : '↓'} {Math.abs(expenseForecast.weeklyTrend).toFixed(1)}%
              </span>
              <span className="text-purple-700 ml-1">vs. monthly average</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800 mb-2">End of Month</h3>
            <div className="text-2xl font-bold text-purple-900 mb-2">
              {formatCurrency(expenseForecast.monthlyExpense, userPreferences.currency, userPreferences.locale)}
            </div>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${
                expenseForecast.monthlyTrend > 0 ? 'text-rose-600' : 'text-green-600'
              }`}>
                {expenseForecast.monthlyTrend > 0 ? '↑' : '↓'} {Math.abs(expenseForecast.monthlyTrend).toFixed(1)}%
              </span>
              <span className="text-purple-700 ml-1">vs. quarterly average</span>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800 mb-2">End of Year</h3>
            <div className="text-2xl font-bold text-purple-900 mb-2">
              {formatCurrency(expenseForecast.yearlyExpense, userPreferences.currency, userPreferences.locale)}
            </div>
            <div className="flex items-center text-sm">
              <span className={`font-medium ${
                expenseForecast.yearlyTrend > 0 ? 'text-rose-600' : 'text-green-600'
              }`}>
                {expenseForecast.yearlyTrend > 0 ? '↑' : '↓'} {Math.abs(expenseForecast.yearlyTrend).toFixed(1)}%
              </span>
              <span className="text-purple-700 ml-1">projected trend</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle size={18} className="text-purple-600 mt-0.5 mr-2" />
            <p className="text-sm text-purple-700">
              These forecasts are based on your current spending patterns and may vary based on future behavior. 
              {expenseForecast.monthlyTrend > 10 && " Your monthly spending is trending significantly higher than usual."}
              {expenseForecast.monthlyTrend < -10 && " Your spending has decreased significantly compared to previous months."}
            </p>
          </div>
        </div>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isAtRisk = daysLeft < 30 && progress < 50;

          return (
            <div 
              key={goal.id}
              className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${
                    goal.priority === 'high' ? 'bg-rose-50 text-rose-600' :
                    goal.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                    <span className="text-sm text-gray-500">{goal.category}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 hover:bg-rose-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} className="text-rose-500" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-800">
                    {formatCurrency(goal.currentAmount, userPreferences.currency, userPreferences.locale)}
                    <span className="text-gray-400 mx-1">/</span>
                    {formatCurrency(goal.targetAmount, userPreferences.currency, userPreferences.locale)}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      progress >= 100 ? 'bg-green-500' :
                      progress >= 75 ? 'bg-blue-500' :
                      progress >= 50 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    {progress.toFixed(0)}% Complete
                  </span>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="text-gray-400 mr-1" />
                    <span className={`${
                      isAtRisk ? 'text-rose-600 font-medium' : 'text-gray-500'
                    }`}>
                      {daysLeft} days left
                    </span>
                  </div>
                </div>

                {isAtRisk && (
                  <div className="flex items-center mt-2 text-sm text-rose-600 bg-rose-50 p-2 rounded-lg">
                    <AlertTriangle size={14} className="mr-1" />
                    <span>Goal at risk! Consider increasing contributions.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Forecast */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Financial Forecast</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp size={20} className="text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Monthly Overview</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Income</span>
                  <span className="font-medium text-blue-800">
                    {formatCurrency(forecastData.monthlyIncome, userPreferences.currency, userPreferences.locale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Expenses</span>
                  <span className="font-medium text-blue-800">
                    {formatCurrency(forecastData.monthlyExpenses, userPreferences.currency, userPreferences.locale)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="text-blue-700">Savings Potential</span>
                  <span className="font-medium text-blue-800">
                    {formatCurrency(forecastData.savingsPotential, userPreferences.currency, userPreferences.locale)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-3">Risk Factors</h3>
              <div className="space-y-2">
                {forecastData.riskFactors.map((risk, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-2 bg-rose-50 rounded-lg text-sm text-rose-700"
                  >
                    <AlertTriangle size={16} className="mr-2 text-rose-600" />
                    {risk}
                  </div>
                ))}
                {forecastData.riskFactors.length === 0 && (
                  <div className="flex items-center p-2 bg-green-50 rounded-lg text-sm text-green-700">
                    <Save size={16} className="mr-2 text-green-600" />
                    No significant risk factors detected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-3">Savings Opportunities</h3>
              <div className="space-y-2">
                {forecastData.opportunities.map((opportunity, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-2 bg-white bg-opacity-50 rounded-lg text-sm text-green-700"
                  >
                    <ChevronRight size={16} className="mr-2 text-green-600" />
                    {opportunity}
                  </div>
                ))}
                {forecastData.opportunities.length === 0 && (
                  <div className="flex items-center p-2 bg-white bg-opacity-50 rounded-lg text-sm text-green-700">
                    <Save size={16} className="mr-2 text-green-600" />
                    You're optimizing your expenses well!
                  </div>
                )}
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <h3  className="font-medium text-amber-800 mb-2">Goal Achievement Forecast</h3>
              <p className="text-amber-700">
                At your current savings rate of{' '}
                <span className="font-medium">
                  {formatCurrency(forecastData.savingsPotential, userPreferences.currency, userPreferences.locale)}
                </span>{' '}
                per month, you can reach a{' '}
                <span className="font-medium">
                  {formatCurrency(50000, userPreferences.currency, userPreferences.locale)}
                </span>{' '}
                emergency fund goal in approximately{' '}
                <span className="font-medium">{forecastData.timeToGoal} months</span>.
              </p>
              {forecastData.savingsPotential < 0 && (
                <div className="mt-3 flex items-center text-sm text-amber-600">
                  <AlertTriangle size={16} className="mr-2" />
                  Your expenses exceed your income. Consider reviewing your budget.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewGoalModal && renderNewGoalModal()}
    </div>
  );
};

export default Goals;