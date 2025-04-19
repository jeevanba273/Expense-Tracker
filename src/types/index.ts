export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  note?: string;
  date: string;
  isRecurring: boolean;
  type: TransactionType;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface Budget {
  categoryId: string;
  limit: number;
  spent: number;
}

export type PlanTier = 'free' | 'pro';

export interface UserPreferences {
  currency: string;
  locale: string;
  planTier: PlanTier;
  stripe_customer_id?: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
}