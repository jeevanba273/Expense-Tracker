import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { clearUserData } from '../utils/storage';
import { initializeUserPreferences } from '../utils/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Only set the user if their email is confirmed
        if (session.user.email_confirmed_at) {
          try {
            // Initialize user preferences
            await initializeUserPreferences(session.user.id);
            setUser(session.user);
          } catch (error) {
            console.error('Error initializing user preferences:', error);
            // Continue setting the user even if preferences fail
            setUser(session.user);
          }
        } else {
          // If email is not confirmed, sign them out
          supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Only set the user if their email is confirmed
        if (session.user.email_confirmed_at) {
          try {
            // Initialize user preferences
            await initializeUserPreferences(session.user.id);
            setUser(session.user);
            setShowAuthModal(false);
          } catch (error) {
            console.error('Error initializing user preferences:', error);
            // Continue setting the user even if preferences fail
            setUser(session.user);
            setShowAuthModal(false);
          }
        } else {
          // If email is not confirmed, sign them out
          await supabase.auth.signOut();
          setUser(null);
        }
      } else {
        if (user) {
          // Clear user data when signing out
          await clearUserData(user.id);
        }
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (user) {
      // Clear user data before signing out
      await clearUserData(user.id);
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signOut,
    showAuthModal,
    setShowAuthModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};