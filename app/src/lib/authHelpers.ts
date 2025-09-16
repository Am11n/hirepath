import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

// Helper function to handle auth state changes
export const setupAuthListener = (setUser: (user: User | null) => void, setLoading: (loading: boolean) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
    setLoading(false);
  });
};