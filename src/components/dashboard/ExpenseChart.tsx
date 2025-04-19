import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatCurrency } from '../../utils/helpers';

interface MousePosition {
  x: number;
  y: number;
}

const ExpenseChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<MousePosition | null>(null);
  const { transactions, categories, userPreferences } = useApp();

  // Calculate expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Prepare chart data
  const chartData = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a) // Sort by amount (highest first)
    .map(([categoryName, amount]) => {
      const category = categories.find(c => c.name === categoryName);
      return {
        label: categoryName,
        value: amount,
        color: category?.color || '#888888'
      };
    });

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    setHoveredIndex(index);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setMousePos(null);
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No expense data yet</p>
          <p className="text-sm text-gray-400 mt-1">Add transactions to see your spending breakdown</p>
        </div>
      </div>
    );
  }

  // For single category, create a simple circle instead of pie segments
  if (chartData.length === 1) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
        
        <div className="relative">
          <div className="flex justify-center mb-6">
            <div 
              className="relative w-[200px] h-[200px] cursor-pointer transition-transform duration-300 hover:scale-105"
              onMouseMove={(e) => handleMouseMove(e, 0)}
              onMouseLeave={handleMouseLeave}
            >
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <filter id="shadow-0">
                    <feDropShadow 
                      dx="0" 
                      dy="4" 
                      stdDeviation="4"
                      floodColor={chartData[0].color}
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill={chartData[0].color}
                  style={{ 
                    filter: hoveredIndex === 0 ? 'url(#shadow-0)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-lg font-medium">{chartData[0].label}</span>
                <span className="text-2xl font-bold mt-1">
                  {formatCurrency(chartData[0].value, userPreferences.currency, userPreferences.locale)}
                </span>
                <span className="text-sm mt-1">100%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3" 
                  style={{ backgroundColor: chartData[0].color }}
                ></div>
                <span className="text-sm text-gray-700">{chartData[0].label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-800">
                  {formatCurrency(chartData[0].value, userPreferences.currency, userPreferences.locale)}
                </span>
                <span className="text-xs text-gray-500 min-w-[45px] text-right">
                  100%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular pie chart for multiple categories
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
      
      <div className="relative">
        <div className="flex justify-center mb-6">
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}>
            <defs>
              {chartData.map((item, index) => (
                <filter key={`shadow-${index}`} id={`shadow-${index}`}>
                  <feDropShadow 
                    dx="0" 
                    dy="0" 
                    stdDeviation="3"
                    floodColor={item.color}
                    floodOpacity="0.5"
                  />
                </filter>
              ))}
            </defs>
            
            {chartData.map((item, index) => {
              const total = chartData.reduce((sum, item) => sum + item.value, 0);
              const startAngle = chartData
                .slice(0, index)
                .reduce((sum, item) => sum + (item.value / total) * 360, 0);
              const angle = (item.value / total) * 360;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = ((startAngle + angle) * Math.PI) / 180;
              const x1 = 100 + 80 * Math.cos(startRad);
              const y1 = 100 + 80 * Math.sin(startRad);
              const x2 = 100 + 80 * Math.cos(endRad);
              const y2 = 100 + 80 * Math.sin(endRad);
              const largeArc = angle > 180 ? 1 : 0;

              const midAngle = startRad + (endRad - startRad) / 2;
              const offsetDistance = hoveredIndex === index ? 10 : 0;
              const translateX = offsetDistance * Math.cos(midAngle);
              const translateY = offsetDistance * Math.sin(midAngle);

              return (
                <g 
                  key={index}
                  transform={`translate(${translateX} ${translateY})`}
                  style={{ 
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    filter: hoveredIndex === index ? `url(#shadow-${index})` : 'none'
                  }}
                >
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onMouseLeave={handleMouseLeave}
                    className="transition-all duration-300 cursor-pointer"
                    style={{ 
                      opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.7,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {hoveredIndex !== null && mousePos && (
            <div 
              className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-10 pointer-events-none transform -translate-x-1/2 transition-all duration-200"
              style={{ 
                left: mousePos.x,
                top: mousePos.y - 80,
                filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))'
              }}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: chartData[hoveredIndex].color }}
                ></div>
                <span className="font-medium">{chartData[hoveredIndex].label}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {formatCurrency(chartData[hoveredIndex].value, userPreferences.currency, userPreferences.locale)}
                <span className="ml-2 text-gray-400">
                  ({((chartData[hoveredIndex].value / totalExpenses) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-800">
                  {formatCurrency(item.value, userPreferences.currency, userPreferences.locale)}
                </span>
                <span className="text-xs text-gray-500 min-w-[45px] text-right">
                  {((item.value / totalExpenses) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;