import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Simple getUserProfile function since service isn't working
  const getUserProfile = async (authUserId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_sa2025')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Initial session found:', session.user.email);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Get user profile
          try {
            const { data: profileData, error: profileError } = await getUserProfile(session.user.id);
            if (profileError) {
              console.warn('Profile error:', profileError);
              // Create a basic profile if none exists
              const basicProfile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email,
                email: session.user.email,
                role: session.user.user_metadata?.role || 'player',
                auth_user_id: session.user.id
              };
              setProfile(basicProfile);
            } else {
              setProfile(profileData);
            }
          } catch (profileErr) {
            console.error('Error fetching profile:', profileErr);
            // Fallback profile
            const fallbackProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'player',
              auth_user_id: session.user.id
            };
            setProfile(fallbackProfile);
          }
        } else {
          console.log('No initial session found');
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
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          try {
            const { data: profileData, error: profileError } = await getUserProfile(session.user.id);
            if (profileError) {
              console.warn('Profile error on auth change:', profileError);
              // Create basic profile
              const basicProfile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email,
                email: session.user.email,
                role: session.user.user_metadata?.role || 'player',
                auth_user_id: session.user.id
              };
              setProfile(basicProfile);
            } else {
              setProfile(profileData);
            }
          } catch (profileErr) {
            console.error('Error fetching profile on auth change:', profileErr);
            // Fallback profile
            const fallbackProfile = {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || session.user.email,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'player',
              auth_user_id: session.user.id
            };
            setProfile(fallbackProfile);
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
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        console.log('Login successful for:', data.user.email);
        
        // Get user profile
        try {
          const { data: profileData, error: profileError } = await getUserProfile(data.user.id);
          
          if (profileError) {
            console.warn('Profile error after login:', profileError);
            // Create basic profile from auth data
            const basicProfile = {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || data.user.email,
              email: data.user.email,
              role: data.user.user_metadata?.role || 'player',
              auth_user_id: data.user.id
            };
            setProfile(basicProfile);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: { ...data.user, ...basicProfile } };
          } else {
            setProfile(profileData);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true, user: { ...data.user, ...profileData } };
          }
        } catch (profileErr) {
          console.error('Error fetching profile after login:', profileErr);
          // Still allow login with fallback profile
          const fallbackProfile = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || data.user.email,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'player',
            auth_user_id: data.user.id
          };
          setProfile(fallbackProfile);
          setUser(data.user);
          setIsAuthenticated(true);
          return { success: true, user: { ...data.user, ...fallbackProfile } };
        }
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      if (!profile) return { success: false, error: 'No profile found' };

      // Simple update since service isn't working
      const { data, error } = await supabase
        .from('user_profiles_sa2025')
        .update({ ...updatedData, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
        .select()
        .single();

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
      sponsor: ['profile', 'ads', 'analytics']
    };

    const permissions = rolePermissions[profile.role] || [];
    return permissions.includes('*') || permissions.includes(permission);
  };

  const value = {
    user: profile ? { ...user, ...profile } : null,
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