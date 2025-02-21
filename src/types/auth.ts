// src/types/auth.ts

// Interface for our User object
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// Interface for managing authentication state
export interface AuthState {
  user: User | null;    // Current user or null if not authenticated
  loading: boolean;     // Loading state for auth operations
  error: string | null; // Error message if auth operation fails
}

// Interface for authentication methods
export interface AuthMethods {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}