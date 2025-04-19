import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/helpers';

const QuickStats: React.FC = () => {
  const { 
    getTotalExpenses, 
    getTotalIncome, 
    getNetAmount,
    transactions,
    userPreferences
  } = useApp();

  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);

  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();
  const netAmount = getNetAmount();
  
  const stats = [
    {
      id: 'income',
      title: 'Total Income',
      value: formatCurrency(totalIncome, userPreferences.currency, userPreferences.locale),
      icon: <TrendingUp className="text-green-500" />,
      change: '+12%',
      changeType: 'positive',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      textColor: 'text-green-700',
      hoverBg: 'hover:bg-green-100',
      details: {
        title: 'Income Details',
        items: transactions
          .filter(t => t.type === 'income')
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
      }
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses, userPreferences.currency, userPreferences.locale),
      icon: <TrendingDown className="text-rose-500" />,
      change: '+8%',
      changeType: 'negative',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      textColor: 'text-rose-700',
      hoverBg: 'hover:bg-rose-100',
      details: {
        title: 'Expense Details',
        items: transactions
          .filter(t => t.type === 'expense')
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5)
      }
    },
    {
      id: 'balance',
      title: 'Net Balance',
      value: formatCurrency(netAmount, userPreferences.currency, userPreferences.locale),
      icon: <Wallet className={netAmount >= 0 ? 'text-blue-500' : 'text-orange-500'} />,
      change: netAmount >= 0 ? 'Positive' : 'Negative',
      changeType: netAmount >= 0 ? 'positive' : 'negative',
      bgColor: netAmount >= 0 ? 'bg-blue-50' : 'bg-orange-50',
      borderColor: netAmount >= 0 ? 'border-blue-100' : 'border-orange-100',
      textColor: netAmount >= 0 ? 'text-blue-700' : 'text-orange-700',
      hoverBg: netAmount >= 0 ? 'hover:bg-blue-100' : 'hover:bg-orange-100',
      details: {
        title: 'Balance Summary',
        summary: true
      }
    }
  ];

  const renderDetailsModal = (statId: string) => {
    const stat = stats.find(s => s.id === statId);
    if (!stat) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{stat.details.title}</h3>
            </div>
            <button
              onClick={() => setShowDetailsModal(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {stat.details.summary ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Total Income</span>
                <span className="font-semibold text-green-700">
                  {formatCurrency(totalIncome, userPreferences.currency, userPreferences.locale)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                <span className="text-rose-700">Total Expenses</span>
                <span className="font-semibold text-rose-700">
                  {formatCurrency(totalExpenses, userPreferences.currency, userPreferences.locale)}
                </span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-lg ${
                netAmount >= 0 ? 'bg-blue-50' : 'bg-orange-50'
              }`}>
                <span className={netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'}>
                  Net Balance
                </span>
                <span className={`font-semibold ${
                  netAmount >= 0 ? 'text-blue-700' : 'text-orange-700'
                }`}>
                  {formatCurrency(netAmount, userPreferences.currency, userPreferences.locale)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {stat.details.items.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.merchant}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <span className={`font-semibold ${
                    item.type === 'expense' ? 'text-rose-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(item.amount, userPreferences.currency, userPreferences.locale)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md ${stat.hoverBg} cursor-pointer transform hover:scale-[1.02] group`}
          onClick={() => setShowDetailsModal(stat.id)}
        >
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm">
              {stat.icon}
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 opacity-10 transform rotate-12 transition-transform group-hover:rotate-45">
              {stat.icon}
            </div>
          </div>
          
          <h3 className="mt-2 text-gray-600 font-medium">{stat.title}</h3>
          <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
          
          <div className="flex items-center mt-2 text-sm">
            <span className={`${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-rose-600'
            } font-medium`}>
              {stat.change}
            </span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
          
          <button className="mt-3 text-sm flex items-center text-gray-600 hover:text-gray-800 transition-colors group-hover:translate-x-1 transform duration-300">
            View details <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      ))}

      {showDetailsModal && renderDetailsModal(showDetailsModal)}
    </div>
  );
};

export default QuickStats;