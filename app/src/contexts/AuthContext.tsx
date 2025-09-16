import type { User } from '@supabase/supabase-js'
import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { setupAuthListener } from '../lib/authHelpers'
import type { AuthContextType } from './auth-context'
import { AuthContext } from './auth-context'

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
      
      // Listen for auth changes
      const { data: { subscription } } = setupAuthListener(setUser, setLoading)
      
      return () => {
        subscription.unsubscribe()
      }
    }
    
    getSession()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value: AuthContextType = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}