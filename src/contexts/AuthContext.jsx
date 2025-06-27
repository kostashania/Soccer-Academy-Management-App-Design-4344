import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock user data - In real app, this would come from your backend
  const mockUsers = {
    'admin@academy.com': {
      id: '1',
      email: 'admin@academy.com',
      name: 'John Admin',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      permissions: ['*']
    },
    'coach@academy.com': {
      id: '2',
      email: 'coach@academy.com',
      name: 'Sarah Coach',
      role: 'coach',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c78d?w=150&h=150&fit=crop&crop=face',
      permissions: ['training', 'attendance', 'players']
    },
    'parent@academy.com': {
      id: '3',
      email: 'parent@academy.com',
      name: 'Mike Parent',
      role: 'parent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      permissions: ['children', 'payments', 'schedule']
    },
    'player@academy.com': {
      id: '4',
      email: 'player@academy.com',
      name: 'Alex Player',
      role: 'player',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      permissions: ['schedule', 'attendance', 'profile']
    }
  };

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock authentication - replace with real API call
      const userData = mockUsers[email];
      
      if (userData && password === 'password123') {
        const token = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  };

  const value = {
    user,
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