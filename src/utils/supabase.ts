import { supabase } from '../lib/supabase';
import type { Transaction, Category, Budget, UserPreferences } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

// Transactions
export async function fetchTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data.map(transaction => ({
    ...transaction,
    isRecurring: transaction.is_recurring // Map from snake_case to camelCase
  })) as Transaction[];
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      amount: transaction.amount,
      category: transaction.category,
      merchant: transaction.merchant,
      note: transaction.note,
      date: transaction.date,
      is_recurring: transaction.isRecurring, // Map from camelCase to snake_case
      type: transaction.type,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    isRecurring: data.is_recurring // Map from snake_case to camelCase
  } as Transaction;
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      amount: transaction.amount,
      category: transaction.category,
      merchant: transaction.merchant,
      note: transaction.note,
      date: transaction.date,
      is_recurring: transaction.isRecurring, // Map from camelCase to snake_case
      type: transaction.type
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    isRecurring: data.is_recurring // Map from snake_case to camelCase
  } as Transaction;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Categories
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(category: Omit<Category, 'id'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      ...category,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

// Budgets
export async function fetchBudgets() {
  const { data, error } = await supabase
    .from('budgets')
    .select('*');

  if (error) throw error;
  return data as Budget[];
}

export async function updateBudget(categoryId: string, budget: Partial<Budget>) {
  const { data, error } = await supabase
    .from('budgets')
    .upsert({
      category_id: categoryId,
      ...budget,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  return data as Budget;
}

// User Preferences
export async function fetchUserPreferences() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('user_preferences')
    .select()
    .match({ user_id: user.id })
    .maybeSingle();

  if (error) throw error;

  // Return default preferences if none exist
  if (!data) {
    return {
      user_id: user.id,
      currency: '₹',
      locale: 'en-IN',
      plan_tier: 'free'
    } as UserPreferences;
  }

  return data as UserPreferences;
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...preferences
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}

// Initialize user preferences
export async function initializeUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      currency: '₹',
      locale: 'en-IN',
      plan_tier: 'free'
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}

// Real-time subscriptions
export function subscribeToUserData(
  onTransactionsUpdate: () => void,
  onCategoriesUpdate: () => void,
  onBudgetsUpdate: () => void,
  onPreferencesUpdate: () => void
): () => void {
  const channels: RealtimeChannel[] = [];

  // Subscribe to transactions changes
  const transactionsChannel = supabase
    .channel('transactions_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions'
      },
      () => onTransactionsUpdate()
    )
    .subscribe();
  channels.push(transactionsChannel);

  // Subscribe to categories changes
  const categoriesChannel = supabase
    .channel('categories_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'categories'
      },
      () => onCategoriesUpdate()
    )
    .subscribe();
  channels.push(categoriesChannel);

  // Subscribe to budgets changes
  const budgetsChannel = supabase
    .channel('budgets_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'budgets'
      },
      () => onBudgetsUpdate()
    )
    .subscribe();
  channels.push(budgetsChannel);

  // Subscribe to preferences changes
  const preferencesChannel = supabase
    .channel('preferences_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_preferences'
      },
      () => onPreferencesUpdate()
    )
    .subscribe();
  channels.push(preferencesChannel);

  // Return cleanup function
  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
  };
}