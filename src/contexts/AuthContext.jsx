import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          // Get user profile
          const { data: profileData } = await userService.getUserProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
          try {
            const { data: profileData } = await userService.getUserProfile(session.user.id);
            setProfile(profileData);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setUser(null);
          setProfile(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authService.signIn(email, password);
      if (error) {
        return { success: false, error: error.message };
      }
      
      setUser(data.user);
      setProfile(data.profile);
      setIsAuthenticated(true);
      return { success: true, user: { ...data.user, ...data.profile } };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      if (!profile) return;
      const { data, error } = await userService.updateUser(profile.id, updatedData);
      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const hasPermission = (permission) => {
    if (!profile) return false;
    
    // Admin has all permissions
    if (profile.role === 'admin') return true;
    
    // Define role-based permissions
    const rolePermissions = {
      admin: ['*'],
      manager: ['users', 'payments', 'inventory', 'groups', 'reports'],
      coach: ['training', 'attendance', 'players', 'groups'],
      parent: ['children', 'payments', 'schedule', 'messages'],
      player: ['schedule', 'attendance', 'profile', 'messages'],
      board_member: ['reports', 'analytics'],
      marketing: ['sponsors', 'marketing', 'analytics'],
      sponsor: ['profile', 'ads', 'analytics'] // Sponsor permissions
    };
    
    const permissions = rolePermissions[profile.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  };

  const value = {
    user: user ? { ...user, ...profile } : null,
    profile,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};