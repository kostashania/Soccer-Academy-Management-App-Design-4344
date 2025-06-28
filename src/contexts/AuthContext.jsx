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
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setUser({ id: parsedProfile.id, email: parsedProfile.email });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, profileData) => {
    try {
      // Mock signup
      const newProfile = {
        id: Date.now().toString(),
        email,
        ...profileData,
        created_at: new Date().toISOString()
      };

      setProfile(newProfile);
      setUser({ id: newProfile.id, email });
      setIsAuthenticated(true);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));

      return { success: true, data: { user: { id: newProfile.id, email } } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      // Mock signin with demo accounts
      let mockProfile = null;

      // Demo accounts with proper credentials
      if (email === 'admin@youthsports.com') {
        mockProfile = {
          id: 'admin1',
          email,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        };
      } else if (email === 'trainer@youthsports.com' || email === 'coach@youthsports.com') {
        mockProfile = {
          id: 'trainer1',
          email,
          first_name: 'Coach',
          last_name: 'Demo',
          role: 'trainer'
        };
      } else if (email === 'parent@youthsports.com') {
        mockProfile = {
          id: 'parent1',
          email,
          first_name: 'Parent',
          last_name: 'Demo',
          role: 'parent'
        };
      } else if (email === 'player@youthsports.com') {
        mockProfile = {
          id: 'player1',
          email,
          first_name: 'Player',
          last_name: 'Demo',
          role: 'player'
        };
      } else if (email === 'sponsor@nike.com' || email === 'sponsor@youthsports.com') {
        mockProfile = {
          id: 'sponsor1',
          email,
          first_name: 'Nike',
          last_name: 'Sponsor',
          role: 'sponsor',
          company_name: 'Nike Greece',
          website_url: 'https://nike.com',
          package_type: 'gold',
          logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'
        };
      } else {
        // Default to parent role for any other email
        mockProfile = {
          id: Date.now().toString(),
          email,
          first_name: 'User',
          last_name: 'Demo',
          role: 'parent'
        };
      }

      setProfile(mockProfile);
      setUser({ id: mockProfile.id, email });
      setIsAuthenticated(true);
      localStorage.setItem('userProfile', JSON.stringify(mockProfile));

      return { success: true, data: { user: { id: mockProfile.id, email } } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userProfile');
  };

  const value = {
    user,
    profile,
    isAuthenticated,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};