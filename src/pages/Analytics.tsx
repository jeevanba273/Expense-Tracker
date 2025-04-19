import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BarChart2,
  Clock8,
  TrendingUp,
  TrendingDown,
  Map
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('day');
  const { transactions, categories, userPreferences } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dayChartRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Array<{x: number; y: number; width: number; height: number; amount: number}>>([]);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredDayBar, setHoveredDayBar] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);
  
  // Reorder days to start with Monday
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate time-of-day data
  const timeOfDayData = HOURS.map(hour => {
    const hourExpenses = transactions
      .filter(t => {
        const txTime = new Date(t.date).getHours();
        return txTime === hour && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      hour,
      amount: hourExpenses,
      label: `${hour}:00`,
      formattedHour: `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`
    };
  });
  
  // Calculate day-of-week data starting from Monday
  const dayOfWeekData = DAYS.map((day, index) => {
    const adjustedDayIndex = (index + 1) % 7;
    const dayExpenses = transactions
      .filter(t => {
        const txDay = new Date(t.date).getDay();
        return txDay === adjustedDayIndex && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      day,
      amount: dayExpenses
    };
  });

  // Calculate seasonal data (monthly)
  const seasonalData = MONTHS.map((month, index) => {
    const monthExpenses = transactions
      .filter(t => {
        const txMonth = new Date(t.date).getMonth();
        return txMonth === index && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      month,
      amount: monthExpenses
    };
  });
  
  // Find peak spending times
  const peakHour = timeOfDayData.reduce((max, current) => 
    current.amount > max.amount ? current : max, timeOfDayData[0]);
    
  const peakDay = dayOfWeekData.reduce((max, current) => 
    current.amount > max.amount ? current : max, dayOfWeekData[0]);

  const peakMonth = seasonalData.reduce((max, current) => 
    current.amount > max.amount ? current : max, seasonalData[0]);
    
  // Calculate the average spending per day
  const totalSpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const days = new Set(transactions.map(t => t.date.split('T')[0])).size || 1;
  const avgDailySpending = totalSpending / days;

  // Mock location data (for Pro users)
  const locationData = [
    { name: 'Local Stores', amount: 2500, percentage: 35 },
    { name: 'Online Shopping', amount: 1800, percentage: 25 },
    { name: 'Restaurants', amount: 1500, percentage: 20 },
    { name: 'Entertainment Venues', amount: 1000, percentage: 15 },
    { name: 'Others', amount: 350, percentage: 5 }
  ];

  useEffect(() => {
    if (!dayChartRef.current || activeTab !== 'day') return;
    
    const ctx = dayChartRef.current.getContext('2d');
    if (!ctx) return;
    
    const width = dayChartRef.current.width;
    const height = dayChartRef.current.height;
    const padding = { left: 100, right: 40, top: 20, bottom: 100 };
    const chartWidth = width - (padding.left + padding.right);
    const chartHeight = height - (padding.top + padding.bottom);
    
    const maxAmount = Math.max(...dayOfWeekData.map(d => d.amount), 1);
    const roundedMaxAmount = Math.ceil(maxAmount / 10000) * 10000;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw y-axis with money labels
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Draw y-axis labels and grid lines
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = height - padding.bottom - (i * (chartHeight / ySteps));
      const amount = (i * (roundedMaxAmount / ySteps));
      
      // Draw grid line
      ctx.beginPath();
      ctx.strokeStyle = '#f3f4f6';
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = '600 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        formatCurrency(amount, userPreferences.currency, userPreferences.locale),
        padding.left - 15,
        y
      );
    }
    
    // Draw x-axis
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();
    
    // Calculate bar dimensions
    const barWidth = Math.min(60, (chartWidth / DAYS.length) * 0.6);
    const barSpacing = (chartWidth - (barWidth * DAYS.length)) / (DAYS.length - 1);
    
    // Store bar positions for hover detection
    const barPositions = [];
    
    // Draw bars and labels
    dayOfWeekData.forEach((data, index) => {
      const barHeight = roundedMaxAmount > 0 ? (data.amount / roundedMaxAmount) * chartHeight : 0;
      const x = padding.left + (index * (barWidth + barSpacing));
      const y = height - padding.bottom - barHeight;
      
      // Store bar position and dimensions for hover detection
      barPositions[index] = {
        x,
        y,
        width: barWidth,
        height: barHeight,
        amount: data.amount
      };
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
      gradient.addColorStop(0, index === hoveredDayBar ? '#3b82f6' : '#93c5fd');
      gradient.addColorStop(1, index === hoveredDayBar ? '#60a5fa' : '#bfdbfe');
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();
      
      // Draw day label
      ctx.fillStyle = '#1f2937';
      ctx.font = '600 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.day, x + (barWidth / 2), height - padding.bottom + 25);
      
      // Draw amount label
      ctx.fillStyle = '#1f2937';
      ctx.font = '500 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        formatCurrency(data.amount, userPreferences.currency, userPreferences.locale),
        x + (barWidth / 2),
        height - padding.bottom + 45
      );
    });
    
    // Store bar positions in a ref for hover detection
    chartRef.current = barPositions;
    
  }, [dayOfWeekData, hoveredDayBar, activeTab, userPreferences]);

  useEffect(() => {
    if (!canvasRef.current || activeTab !== 'time') return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = { left: 100, right: 40, top: 20, bottom: 100 };
    const chartWidth = width - (padding.left + padding.right);
    const chartHeight = height - (padding.top + padding.bottom);
    
    const maxAmount = Math.max(...timeOfDayData.map(d => d.amount), 1);
    const roundedMaxAmount = Math.ceil(maxAmount / 1000) * 1000;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw y-axis with money labels
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // Draw y-axis labels and grid lines
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = height - padding.bottom - (i * (chartHeight / ySteps));
      const amount = (i * (roundedMaxAmount / ySteps));
      
      // Draw grid line
      ctx.beginPath();
      ctx.strokeStyle = '#f3f4f6';
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#1f2937';
      ctx.font = '600 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        formatCurrency(amount, userPreferences.currency, userPreferences.locale),
        padding.left - 15,
        y
      );
    }
    
    // Draw x-axis
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();
    
    // Calculate bar dimensions
    const barWidth = Math.min(20, (chartWidth / HOURS.length) * 0.6);
    const barSpacing = (chartWidth - (barWidth * HOURS.length)) / (HOURS.length - 1);
    
    // Store bar positions for hover detection
    const barPositions = [];
    
    // Draw bars and labels
    timeOfDayData.forEach((data, index) => {
      const barHeight = roundedMaxAmount > 0 ? (data.amount / roundedMaxAmount) * chartHeight : 0;
      const x = padding.left + (index * (barWidth + barSpacing));
      const y = height - padding.bottom - barHeight;
      
      // Store bar position and dimensions for hover detection
      barPositions[index] = {
        x,
        y,
        width: barWidth,
        height: barHeight,
        amount: data.amount
      };
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - padding.bottom);
      gradient.addColorStop(0, index === hoveredBar ? '#9333ea' : '#d8b4fe');
      gradient.addColorStop(1, index === hoveredBar ? '#a855f7' : '#e9d5ff');
      
      // Draw bar
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();
      
      // Draw time label (every 3 hours)
      if (index % 3 === 0) {
        ctx.fillStyle = '#1f2937';
        ctx.font = '600 12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.formattedHour, x + (barWidth / 2), height - padding.bottom + 25);
      }
    });
    
    // Store bar positions in a ref for hover detection
    chartRef.current = barPositions;
    
  }, [timeOfDayData, hoveredBar, activeTab, userPreferences]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dayChartRef.current || !chartRef.current) return;
    
    const rect = dayChartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale mouse coordinates to canvas coordinates
    const scaleX = dayChartRef.current.width / rect.width;
    const scaleY = dayChartRef.current.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    setMousePos({ x: e.clientX, y: e.clientY });
    
    // Find which bar is being hovered using precise hit detection
    const hoveredIndex = chartRef.current.findIndex(bar => 
      canvasX >= bar.x && 
      canvasX <= bar.x + bar.width && 
      canvasY >= bar.y && 
      canvasY <= bar.y + bar.height
    );
    
    setHoveredDayBar(hoveredIndex >= 0 ? hoveredIndex : null);
  };

  const handleCanvasMouseLeave = () => {
    setHoveredDayBar(null);
    setMousePos(null);
  };

  const handleTimeChartMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !chartRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale mouse coordinates to canvas coordinates
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    setMousePos({ x: e.clientX, y: e.clientY });
    
    // Find which bar is being hovered using precise hit detection
    const hoveredIndex = chartRef.current.findIndex(bar => 
      canvasX >= bar.x && 
      canvasX <= bar.x + bar.width && 
      canvasY >= bar.y && 
      canvasY <= bar.y + bar.height
    );
    
    setHoveredBar(hoveredIndex >= 0 ? hoveredIndex : null);
  };

  const handleTimeChartMouseLeave = () => {
    setHoveredBar(null);
    setMousePos(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
      
      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-blue-100">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-blue-50">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
          
          <h3 className="mt-2 text-gray-600 font-medium">Peak Spending Day</h3>
          <p className="text-xl font-bold mt-1 text-blue-700">{peakDay.day}</p>
          
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">
              {formatCurrency(peakDay.amount, userPreferences.currency, userPreferences.locale)} average
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-purple-100">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-purple-50">
              <Clock size={20} className="text-purple-600" />
            </div>
          </div>
          
          <h3 className="mt-2 text-gray-600 font-medium">Peak Spending Time</h3>
          <p className="text-xl font-bold mt-1 text-purple-700">{peakHour.formattedHour}</p>
          
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">
              {formatCurrency(peakHour.amount, userPreferences.currency, userPreferences.locale)} total
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 border border-amber-100">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-lg bg-amber-50">
              <BarChart2 size={20} className="text-amber-600" />
            </div>
          </div>
          
          <h3 className="mt-2 text-gray-600 font-medium">Average Daily Spend</h3>
          <p className="text-xl font-bold mt-1 text-amber-700">
            {formatCurrency(avgDailySpending, userPreferences.currency, userPreferences.locale)}
          </p>
          
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-500">
              Based on {days} days of data
            </span>
          </div>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('day')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'day'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar size={16} className="inline mr-2" />
              Day of Week
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'time'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock size={16} className="inline mr-2" />
              Time of Day
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'location'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MapPin size={16} className="inline mr-2" />
              Location
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === 'patterns'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock8 size={16} className="inline mr-2" />
              Seasonal Patterns
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'day' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Spending by Day of Week</h2>
              
              <div className="relative h-[300px] mb-8">
                <canvas 
                  ref={dayChartRef}
                  width="600" 
                  height="300"
                  onMouseMove={handleCanvasMouseMove}
                  onMouseLeave={handleCanvasMouseLeave}
                  className="cursor-pointer w-full"
                ></canvas>

                {hoveredDayBar !== null && mousePos && (
                  <div 
                    className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-10 pointer-events-none transform -translate-x-1/2"
                    style={{ 
                      left: mousePos.x,
                      top: mousePos.y - 80
                    }}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {dayOfWeekData[hoveredDayBar].day}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(dayOfWeekData[hoveredDayBar].amount, userPreferences.currency, userPreferences.locale)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Key Insight</h3>
                <p className="text-blue-700">
                  You spend the most on <span className="font-medium">{peakDay.day}</span>, 
                  which accounts for 
                  <span className="font-medium"> 
                    {' '}{(peakDay.amount / totalSpending * 100).toFixed(1)}%
                  </span> of your total expenses.
                  {peakDay.day === 'Sat' || peakDay.day === 'Sun' ? (
                    ' Consider planning your weekend activities more budget-friendly.'
                  ) : (
                    ' Try to spread your expenses more evenly throughout the week.'
                  )}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'time' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Spending by Time of Day</h2>
              
              <div className="relative h-[300px] mb-8">
                <canvas 
                  ref={canvasRef}
                  width="800" 
                  height="300"
                  onMouseMove={handleTimeChartMouseMove}
                  onMouseLeave={handleTimeChartMouseLeave}
                  className="cursor-pointer w-full"
                ></canvas>

                {hoveredBar !== null && mousePos && (
                  <div 
                    className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-10 pointer-events-none transform -translate-x-1/2"
                    style={{ 
                      left: mousePos.x,
                      top: mousePos.y - 80
                    }}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {timeOfDayData[hoveredBar].formattedHour}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(timeOfDayData[hoveredBar].amount, userPreferences.currency, userPreferences.locale)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Key Insight</h3>
                <p className="text-purple-700">
                  Your peak spending time is around <span className="font-medium">{peakHour.formattedHour}</span>. 
                  {peakHour.hour >= 12 && peakHour.hour <= 14 ? (
                    ' This suggests lunch expenses are a significant part of your budget. Consider meal prepping to reduce costs.'
                  ) : peakHour.hour >= 17 && peakHour.hour <= 20 ? (
                    ' This corresponds with dinner time. Look for dining deals or cook at home more often to save.'
                  ) : (
                    ' Be mindful of your spending habits during this time period.'
                  )}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'location' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Spending by Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {locationData.map((location, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{location.name}</span>
                        <span className="text-sm text-gray-500">{location.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {formatCurrency(location.amount, userPreferences.currency, userPreferences.locale)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Map className="text-blue-600 mr-2" size={24} />
                    <h3 className="text-lg font-semibold text-blue-800">Location Insights</h3>
                  </div>
                  <div className="space-y-4 text-blue-700">
                    <p>
                      <strong>35%</strong> of your spending occurs at local stores, 
                      suggesting you prefer shopping in person.
                    </p>
                    <p>
                      <strong>25%</strong> is spent on online shopping, 
                      which could be optimized with better price comparison.
                    </p>
                    <p>
                      Consider consolidating your shopping trips to reduce 
                      transportation costs and impulse purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'patterns' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Seasonal Spending Patterns</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <div className="flex h-full items-end space-x-2">
                    {seasonalData.map((monthData, index) => {
                      const maxAmount = Math.max(...seasonalData.map(m => m.amount));
                      const height = maxAmount > 0 ? (monthData.amount / maxAmount) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className={`w-full rounded-t-lg ${
                              monthData.month === peakMonth.month ? 'bg-green-500' : 'bg-green-200'
                            }`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs mt-2 text-gray-600 font-medium">
                            {monthData.month}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(monthData.amount, userPreferences.currency, userPreferences.locale)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Clock8 className="text-green-600 mr-2" size={24} />
                    <h3 className="text-lg font-semibold text-green-800">Seasonal Insights</h3>
                  </div>
                  <div className="space-y-4 text-green-700">
                    <p>
                      Your highest spending month is <strong>{peakMonth.month}</strong>, 
                      with {formatCurrency(peakMonth.amount, userPreferences.currency, userPreferences.locale)} in expenses.
                    </p>
                    <p>
                      This could be due to seasonal events, holidays, or regular billing cycles. 
                      Plan ahead for these high-spend periods.
                    </p>
                    <p>
                      Consider setting aside extra savings in lower-spend months 
                      to better manage peak spending seasons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;