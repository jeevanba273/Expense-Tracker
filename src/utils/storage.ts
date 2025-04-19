import { Transaction, Category, Budget, UserPreferences } from '../types';
import { supabase } from '../lib/supabase';

// IndexedDB setup
const DB_NAME = 'expense-tracker-db';
const DB_VERSION = 3; // Increment version to trigger upgrade
const TRANSACTION_STORE = 'transactions';
const CATEGORY_STORE = 'categories';
const BUDGET_STORE = 'budgets';
const PREFERENCES_STORE = 'preferences';

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Delete existing stores if they exist
      if (db.objectStoreNames.contains(TRANSACTION_STORE)) {
        db.deleteObjectStore(TRANSACTION_STORE);
      }
      if (db.objectStoreNames.contains(CATEGORY_STORE)) {
        db.deleteObjectStore(CATEGORY_STORE);
      }
      if (db.objectStoreNames.contains(BUDGET_STORE)) {
        db.deleteObjectStore(BUDGET_STORE);
      }
      if (db.objectStoreNames.contains(PREFERENCES_STORE)) {
        db.deleteObjectStore(PREFERENCES_STORE);
      }
      
      // Create transaction store with indices
      const transactionStore = db.createObjectStore(TRANSACTION_STORE, { keyPath: 'id' });
      transactionStore.createIndex('date', 'date', { unique: false });
      transactionStore.createIndex('category', 'category', { unique: false });
      transactionStore.createIndex('userId', 'userId', { unique: false });
      
      // Create category store with indices
      const categoryStore = db.createObjectStore(CATEGORY_STORE, { keyPath: 'id' });
      categoryStore.createIndex('userId', 'userId', { unique: false });
      
      // Create budget store with indices
      const budgetStore = db.createObjectStore(BUDGET_STORE, { keyPath: 'categoryId' });
      budgetStore.createIndex('userId', 'userId', { unique: false });
      
      // Create preferences store with indices
      const preferencesStore = db.createObjectStore(PREFERENCES_STORE, { keyPath: 'id' });
      preferencesStore.createIndex('userId', 'userId', { unique: false });
    };
  });
};

// Get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Clear all data for a specific user
export const clearUserData = async (userId: string): Promise<void> => {
  const db = await openDatabase();
  const stores = [TRANSACTION_STORE, CATEGORY_STORE, BUDGET_STORE, PREFERENCES_STORE];

  await Promise.all(stores.map(storeName => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('userId');
      const request = index.openCursor(IDBKeyRange.only(userId));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }));
};

// Generic function to get all items from a store for a specific user
const getAllItems = async <T>(storeName: string): Promise<T[]> => {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const db = await openDatabase();
  return new Promise<T[]>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('userId');
    const request = index.getAll(IDBKeyRange.only(userId));

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Generic function to save an item to a store
const saveItem = async <T extends { id: string }>(storeName: string, item: T): Promise<T> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user');

  const itemWithUserId = { ...item, userId };
  const db = await openDatabase();
  
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(itemWithUserId);

    request.onsuccess = () => {
      resolve(itemWithUserId as T);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Generic function to delete an item from a store
const deleteItem = async (storeName: string, id: string): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user');

  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Transaction specific functions
export const getTransactions = (): Promise<Transaction[]> => {
  return getAllItems<Transaction>(TRANSACTION_STORE);
};

export const saveTransaction = (transaction: Transaction): Promise<Transaction> => {
  return saveItem<Transaction>(TRANSACTION_STORE, transaction);
};

export const deleteTransaction = (id: string): Promise<void> => {
  return deleteItem(TRANSACTION_STORE, id);
};

// Category specific functions
export const getCategories = (): Promise<Category[]> => {
  return getAllItems<Category>(CATEGORY_STORE);
};

export const saveCategory = (category: Category): Promise<Category> => {
  return saveItem<Category>(CATEGORY_STORE, category);
};

export const deleteCategory = (id: string): Promise<void> => {
  return deleteItem(CATEGORY_STORE, id);
};

// Budget specific functions
export const getBudgets = (): Promise<Budget[]> => {
  return getAllItems<Budget>(BUDGET_STORE);
};

export const saveBudget = (budget: Budget): Promise<Budget> => {
  return saveItem<Budget>(BUDGET_STORE, budget);
};

// User preferences functions
export const getUserPreferences = async (): Promise<UserPreferences | null> => {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const db = await openDatabase();
  return new Promise<UserPreferences | null>((resolve, reject) => {
    const transaction = db.transaction(PREFERENCES_STORE, 'readonly');
    const store = transaction.objectStore(PREFERENCES_STORE);
    const index = store.index('userId');
    const request = index.get(userId);

    request.onsuccess = () => {
      resolve(request.result?.data || null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<UserPreferences> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user');

  const db = await openDatabase();
  return new Promise<UserPreferences>((resolve, reject) => {
    const transaction = db.transaction(PREFERENCES_STORE, 'readwrite');
    const store = transaction.objectStore(PREFERENCES_STORE);
    const request = store.put({ id: `${userId}-preferences`, userId, data: preferences });

    request.onsuccess = () => {
      resolve(preferences);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Export and Import functions
export const exportData = async (): Promise<string> => {
  const transactions = await getTransactions();
  const categories = await getCategories();
  const budgets = await getBudgets();
  const preferences = await getUserPreferences();

  const exportData = {
    transactions,
    categories,
    budgets,
    preferences,
    exportDate: new Date().toISOString()
  };

  return JSON.stringify(exportData);
};

export const importData = async (jsonData: string): Promise<void> => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('No authenticated user');

  try {
    const data = JSON.parse(jsonData);
    
    // Clear existing user data
    await clearUserData(userId);
    
    // Import new data
    if (data.transactions) {
      await Promise.all(data.transactions.map((t: Transaction) => saveTransaction(t)));
    }
    
    if (data.categories) {
      await Promise.all(data.categories.map((c: Category) => saveCategory(c)));
    }
    
    if (data.budgets) {
      await Promise.all(data.budgets.map((b: Budget) => saveBudget(b)));
    }
    
    if (data.preferences) {
      await saveUserPreferences(data.preferences);
    }
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Failed to import data');
  }
};