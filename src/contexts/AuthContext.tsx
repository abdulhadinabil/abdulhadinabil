import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, signInWithEmail, signOut } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user on mount
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        console.error('Login error:', error);
        setLoading(false);
        return false;
      }

      if (data.user) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};