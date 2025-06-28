import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-toastify'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        toast.error('Authentication error')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setProfile(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (profile) {
        setProfile(profile)
      } else {
        // Create default profile if doesn't exist
        const defaultProfile = {
          id: userId,
          first_name: '',
          last_name: '',
          role: 'parent',
          created_at: new Date().toISOString()
        }
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single()

        if (createError) throw createError
        setProfile(newProfile)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role || 'parent'
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Create profile
        const profileData = {
          id: data.user.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role || 'parent',
          created_at: new Date().toISOString()
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (profileError) throw profileError

        toast.success('Account created successfully!')
        return { success: true, data }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('Signed in successfully!')
      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(error.message)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      setIsAuthenticated(false)
      toast.success('Signed out successfully!')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Error signing out')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast.success('Profile updated successfully!')
      return { success: true, data }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}