import type { User } from '@supabase/supabase-js';
import { createContext } from 'react';

export interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, userData?: { firstName: string; lastName: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);