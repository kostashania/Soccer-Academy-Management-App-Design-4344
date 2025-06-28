import React, {createContext, useContext, useState, useEffect} from 'react'
import {toast} from 'react-toastify'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock authentication for demo
  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('demo_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setProfile(userData)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      // Mock signup
      const newUser = {
        id: Date.now().toString(),
        email,
        ...userData,
        created_at: new Date().toISOString()
      }
      setUser(newUser)
      setProfile(newUser)
      setIsAuthenticated(true)
      localStorage.setItem('demo_user', JSON.stringify(newUser))
      toast.success('Account created successfully!')
      return {success: true, data: newUser}
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('Failed to create account')
      return {success: false, error: error.message}
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      // Demo accounts with correct credentials
      const demoAccounts = {
        'admin@academy.com': {
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        },
        'coach@academy.com': {
          role: 'coach', 
          first_name: 'Coach',
          last_name: 'Demo'
        },
        'parent@academy.com': {
          role: 'parent',
          first_name: 'Parent', 
          last_name: 'Demo'
        },
        'player@academy.com': {
          role: 'player',
          first_name: 'Player',
          last_name: 'Demo'
        },
        'sponsor@academy.com': {
          role: 'sponsor',
          first_name: 'Sponsor',
          last_name: 'Demo',
          company_name: 'Nike Greece'
        },
        // Additional working emails
        'admin@youthsports.com': {
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User'
        },
        'trainer@academy.com': {
          role: 'trainer',
          first_name: 'Trainer',
          last_name: 'Demo'
        }
      }

      const userData = demoAccounts[email]
      
      // Accept both "password123" and "admin123" etc
      const validPasswords = ['password123', 'admin123', 'demo123', 'test123']
      
      if (userData && validPasswords.includes(password)) {
        const user = {
          id: Date.now().toString(),
          email,
          ...userData,
          name: `${userData.first_name} ${userData.last_name}`
        }
        setUser(user)
        setProfile(user)
        setIsAuthenticated(true)
        localStorage.setItem('demo_user', JSON.stringify(user))
        toast.success('Signed in successfully!')
        return {success: true, data: user}
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Invalid email or password')
      return {success: false, error: error.message}
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      setProfile(null)
      setIsAuthenticated(false)
      localStorage.removeItem('demo_user')
      toast.success('Signed out successfully!')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Error signing out')
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const updatedProfile = {...profile, ...updates}
      setProfile(updatedProfile)
      localStorage.setItem('demo_user', JSON.stringify(updatedProfile))
      toast.success('Profile updated successfully!')
      return {success: true, data: updatedProfile}
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
      return {success: false, error: error.message}
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
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}