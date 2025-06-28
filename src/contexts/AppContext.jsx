import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user, profile } = useAuth();

  // Mock data
  const [platformButtons, setPlatformButtons] = useState([
    { id: '1', text: 'Google Drive', url: 'https://drive.google.com' },
    { id: '2', text: 'Team Calendar', url: 'https://calendar.google.com' }
  ]);

  // Platform button management
  const addPlatformButton = (buttonData) => {
    const newButton = {
      id: Date.now().toString(),
      ...buttonData
    };
    setPlatformButtons(prev => [...prev, newButton]);
  };

  const updatePlatformButton = (id, updates) => {
    setPlatformButtons(prev => 
      prev.map(button => 
        button.id === id ? { ...button, ...updates } : button
      )
    );
  };

  const deletePlatformButton = (id) => {
    setPlatformButtons(prev => prev.filter(button => button.id !== id));
  };

  const value = {
    // Platform buttons
    platformButtons,
    addPlatformButton,
    updatePlatformButton,
    deletePlatformButton
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};