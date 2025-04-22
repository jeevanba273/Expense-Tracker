import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  Transaction, 
  Category, 
  Budget, 
  UserPreferences,
  PlanTier
} from '../types';
import { 
  fetchTransactions,
  createTransaction,
  updateTransaction as updateSupabaseTransaction,
  deleteTransaction as deleteSupabaseTransaction,
  fetchCategories,
  createCategory as createSupabaseCategory,
  fetchBudgets,
  updateBudget as updateSupabaseBudget,
  fetchUserPreferences,
  updateUserPreferences as updateSupabasePreferences,
  subscribeToUserData
} from '../utils/supabase';

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  userPreferences: UserPreferences;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateBudget: (categoryId: string, limit: number) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  getTransactionsByCategory: () => Record<string, number>;
  getTransactionsByDay: () => Record<string, number>;
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  getNetAmount: () => number;
  isFeatureAvailable: (feature: string) => boolean;
  refreshUserPreferences: () => Promise<void>;
}

const defaultUserPreferences: UserPreferences = {
  currency: '₹',
  locale: 'en-IN',
  planTier: 'free'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserPreferences);

  const refreshUserPreferences = async () => {
    if (!user) {
      console.log('No user, skipping preference refresh');
      return;
    }
    try {
      console.log('Refreshing user preferences for user:', user.id);
      const prefs = await fetchUserPreferences();
      console.log('Fetched preferences:', prefs);
      
      if (prefs) {
        // Check if preferences actually changed before updating state
        const prefsChanged = JSON.stringify(prefs) !== JSON.stringify(userPreferences);
        console.log('Preferences changed:', prefsChanged);
        
        if (prefsChanged) {
          console.log('Updating preferences in state:', prefs);
          setUserPreferences(prefs);
        } else {
          console.log('Preferences unchanged, skipping update');
        }
      } else {
        console.log('No preferences found, using defaults');
        setUserPreferences(defaultUserPreferences);
      }
    } catch (error) {
      console.error('Error refreshing user preferences:', error);
      // Don't throw, just log the error and keep existing preferences
    }
  };

  // Load initial data when user changes
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!user) {
        // Clear all data when user logs out
        setTransactions([]);
        setCategories([]);
        setBudgets([]);
        setUserPreferences(defaultUserPreferences);
        return;
      }

      try {
        console.log('Loading initial data for user:', user.id);
        const [
          transactionsData,
          categoriesData,
          budgetsData,
          preferencesData
        ] = await Promise.all([
          fetchTransactions(),
          fetchCategories(),
          fetchBudgets(),
          fetchUserPreferences()
        ]);

        if (!mounted) return;

        setTransactions(transactionsData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
        if (preferencesData) {
          console.log('Setting initial preferences:', preferencesData);
          setUserPreferences(preferencesData);
        } else {
          console.log('No initial preferences found, using defaults');
          setUserPreferences(defaultUserPreferences);
        }

        // Initialize with default categories if none exist
        if (categoriesData.length === 0) {
          const defaultCategories: Omit<Category, 'id'>[] = [
            { name: 'Food', emoji: '🍔', color: '#3B82F6' },
            { name: 'Transport', emoji: '🚗', color: '#10B981' },
            { name: 'Shopping', emoji: '🛍️', color: '#F59E0B' },
            { name: 'Entertainment', emoji: '🎬', color: '#8B5CF6' },
            { name: 'Bills', emoji: '📄', color: '#EC4899' },
            { name: 'Salary', emoji: '💰', color: '#22C55E' },
          ];

          for (const category of defaultCategories) {
            if (mounted) {
              await addCategory(category);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscriptions for user:', user.id);
    
    const unsubscribe = subscribeToUserData(
      () => {
        console.log('Real-time transaction update received');
        fetchTransactions().then(data => setTransactions(data));
      },
      () => {
        console.log('Real-time category update received');
        fetchCategories().then(data => setCategories(data));
      },
      () => {
        console.log('Real-time budget update received');
        fetchBudgets().then(data => setBudgets(data));
      },
      () => {
        console.log('Real-time preferences update received');
        fetchUserPreferences().then(prefs => {
          if (prefs) {
            console.log('New preferences received:', prefs);
            setUserPreferences(prefs);
          }
        });
      }
    );

    return () => {
      console.log('Cleaning up real-time subscriptions');
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTransaction = await createTransaction(transaction);
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const updatedTransaction = await updateSupabaseTransaction(id, transaction);
    setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
  };

  const removeTransaction = async (id: string) => {
    if (!user) return;
    await deleteSupabaseTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    const newCategory = await createSupabaseCategory(category);
    setCategories(prev => [...prev, newCategory]);
  };

  const updateBudget = async (categoryId: string, limit: number) => {
    if (!user) return;
    const updatedBudget = await updateSupabaseBudget(categoryId, { limit });
    setBudgets(prev => {
      const index = prev.findIndex(b => b.categoryId === categoryId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = updatedBudget;
        return updated;
      }
      return [...prev, updatedBudget];
    });
  };

  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    console.log('Updating user preferences:', preferences);
    try {
      const updatedPreferences = await updateSupabasePreferences(preferences);
      console.log('Preferences updated successfully:', updatedPreferences);
      setUserPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const getTransactionsByCategory = () => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const getTransactionsByDay = () => {
    return transactions.reduce((acc, transaction) => {
      const day = new Date(transaction.date).getDay();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      if (transaction.type === 'expense') {
        acc[dayNames[day]] = (acc[dayNames[day]] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetAmount = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const isFeatureAvailable = (feature: string): boolean => {
    if (!userPreferences?.planTier) return false;
    
    const featureMap: Record<string, PlanTier[]> = {
      'advancedAnalytics': ['pro'],
      'unlimitedTransactions': ['pro'],
      'googleDriveBackup': ['pro'],
      'familyWorkspace': ['pro'],
      'goalSimulator': ['pro'],
      'recurringBillAlerts': ['pro'],
      'customCategories': ['pro']
    };

    const requiredTiers = featureMap[feature] || [];
    return requiredTiers.includes(userPreferences.planTier);
  };

  const value = {
    transactions,
    categories,
    budgets,
    userPreferences,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addCategory,
    updateBudget,
    updateUserPreferences,
    getTransactionsByCategory,
    getTransactionsByDay,
    getTotalExpenses,
    getTotalIncome,
    getNetAmount,
    isFeatureAvailable,
    refreshUserPreferences
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};