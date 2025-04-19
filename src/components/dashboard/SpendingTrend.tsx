import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getLastNDays, calculateDailyTotals, formatCurrency } from '../../utils/helpers';

const SpendingTrend: React.FC = () => {
  const { transactions, userPreferences } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);

  // Get last 7 days
  const last7Days = getLastNDays(7);
  
  // Calculate totals for each day
  const dailyTotals = calculateDailyTotals(transactions, last7Days);
  
  // Format dates for display
  const formattedDates = last7Days.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString(userPreferences.locale, { weekday: 'short' });
  });
  
  // Calculate today's burn rate compared to 7-day average
  const todayTotal = dailyTotals[dailyTotals.length - 1] || 0;
  const averageTotal = dailyTotals.reduce((sum, val) => sum + val, 0) / dailyTotals.length || 0;
  const burnRateDiff = todayTotal - averageTotal;
  const burnRatePercentage = averageTotal ? (burnRateDiff / averageTotal) * 100 : 0;

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const maxValue = Math.max(...dailyTotals, 1);
    
    const drawChart = (hoveredIndex: number | null) => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw axes
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw bars
      const barWidth = (chartWidth / dailyTotals.length) - 10;
      
      dailyTotals.forEach((total, index) => {
        const barHeight = (total / maxValue) * chartHeight;
        const x = padding + (index * (chartWidth / dailyTotals.length)) + 5;
        const y = height - padding - barHeight;
        
        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        
        if (index === hoveredIndex) {
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#60a5fa');
          ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
          ctx.shadowBlur = 10;
        } else if (index === dailyTotals.length - 1) {
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#93c5fd');
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        } else {
          gradient.addColorStop(0, '#93c5fd');
          gradient.addColorStop(1, '#bfdbfe');
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
        
        // Draw day label
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(formattedDates[index], x + (barWidth / 2), height - 5);
      });
    };
    
    drawChart(hoveredBar);
    
  }, [dailyTotals, formattedDates, hoveredBar]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    const width = canvasRef.current.width;
    const padding = 20;
    const chartWidth = width - (padding * 2);
    const barWidth = chartWidth / dailyTotals.length;
    
    const barIndex = Math.floor((x - padding) / barWidth);
    
    if (barIndex >= 0 && barIndex < dailyTotals.length) {
      setHoveredBar(barIndex);
    } else {
      setHoveredBar(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
    setMousePos(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">7-Day Spending Trend</h2>
      
      <div className="relative h-48 mb-4">
        <canvas 
          ref={canvasRef} 
          width="400" 
          height="200"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-pointer"
        ></canvas>
        
        {hoveredBar !== null && mousePos && (
          <div 
            className="absolute bg-white p-2 rounded-lg shadow-lg border border-gray-100 z-10 pointer-events-none transform -translate-x-1/2 transition-opacity duration-200"
            style={{ 
              left: mousePos.x,
              top: mousePos.y - 60
            }}
          >
            <div className="text-sm font-medium text-gray-800">
              {formattedDates[hoveredBar]}
            </div>
            <div className="text-sm text-gray-600">
              {formatCurrency(dailyTotals[hoveredBar], userPreferences.currency, userPreferences.locale)}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div>
          <p className="text-sm text-gray-500">Today's burn rate</p>
          <p className="text-lg font-semibold text-gray-800">
            {formatCurrency(todayTotal, userPreferences.currency, userPreferences.locale)}
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">vs 7-day average</p>
          <div className="flex items-center">
            {burnRateDiff > 0 ? (
              <>
                <TrendingUp size={16} className="text-rose-500 mr-1" />
                <p className="text-rose-500 font-medium">
                  {formatCurrency(Math.abs(burnRateDiff), userPreferences.currency, userPreferences.locale)} 
                  ({Math.abs(burnRatePercentage).toFixed(0)}% higher)
                </p>
              </>
            ) : burnRateDiff < 0 ? (
              <>
                <TrendingDown size={16} className="text-green-500 mr-1" />
                <p className="text-green-500 font-medium">
                  {formatCurrency(Math.abs(burnRateDiff), userPreferences.currency, userPreferences.locale)} 
                  ({Math.abs(burnRatePercentage).toFixed(0)}% lower)
                </p>
              </>
            ) : (
              <p className="text-gray-500">No change</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingTrend;