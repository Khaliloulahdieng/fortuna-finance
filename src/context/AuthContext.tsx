// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import type { AuthState, User, AuthMethods } from '../types/auth';
import { FirebaseAuthService } from '../services/firebase/auth';

// Combine AuthState and AuthMethods for our context type
type AuthContextType = AuthState & AuthMethods;

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps your app and makes auth available to any
 * child component that calls useAuth().
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // State to hold user authentication status and loading state
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any 
  // component that utilizes this hook to re-render with the latest auth object.
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          createdAt: new Date(),
        };
        setState({ user, loading: false, error: null });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Create the auth context value
  const value: AuthContextType = {
    ...state,
    signIn: async (email, password) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        await FirebaseAuthService.signIn(email, password);
      } catch (error: any) {
        setState(prev => ({ ...prev, error: error.message }));
        throw error;
      }
    },
    signUp: async (email, password) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        await FirebaseAuthService.signUp(email, password);
      } catch (error: any) {
        setState(prev => ({ ...prev, error: error.message }));
        throw error;
      }
    },
    signOut: async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        await FirebaseAuthService.signOut();
      } catch (error: any) {
        setState(prev => ({ ...prev, error: error.message }));
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for components to get the auth object and re-render when it changes.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};