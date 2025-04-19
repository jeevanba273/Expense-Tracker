import { Transaction, ChartData, Category } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const formatCurrency = (
  amount: number, 
  currency: string = '₹', 
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === '₹' ? 'INR' : 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  .format(amount)
  .replace('₹', currency); // Handle special rupee symbol if needed
};

export const formatDate = (
  dateString: string, 
  locale: string = 'en-IN'
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getLastNDays = (n: number): string[] => {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.toISOString().split('T')[0]);
  }
  return result;
};

export const calculateDailyTotals = (
  transactions: Transaction[], 
  days: string[]
): number[] => {
  const dailyTotals = days.map(day => {
    return transactions
      .filter(t => t.date.startsWith(day) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  return dailyTotals;
};

export const calculateAverageDailySpend = (transactions: Transaction[]): number => {
  if (transactions.length === 0) return 0;
  
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return 0;
  
  const totalAmount = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  // Get earliest and latest dates
  const dates = expenses.map(t => new Date(t.date).getTime());
  const earliestDate = new Date(Math.min(...dates));
  const latestDate = new Date(Math.max(...dates));
  
  // Calculate days between (inclusive of both start and end date)
  const daysDiff = Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return totalAmount / daysDiff;
};

export const prepareChartData = (
  transactions: Transaction[], 
  categories: Category[]
): ChartData => {
  const categoryTotals: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      categoryTotals[transaction.category] = 
        (categoryTotals[transaction.category] || 0) + transaction.amount;
    });
  
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);
  
  // Get colors from the categories array
  const colors = labels.map(label => {
    const category = categories.find(c => c.name === label);
    return category ? category.color : getRandomColor();
  });

  return { labels, values, colors };
};

export const downloadJSON = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = ['Date', 'Type', 'Amount', 'Category', 'Merchant', 'Note', 'Recurring'];
  
  const rows = transactions.map(t => [
    t.date,
    t.type,
    t.amount.toString(),
    t.category,
    t.merchant,
    t.note || '',
    t.isRecurring ? 'Yes' : 'No'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};