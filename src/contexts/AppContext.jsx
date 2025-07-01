import React, {createContext, useContext, useState} from 'react';
import {useAuth} from './AuthContext';
import {toast} from 'react-toastify';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({children}) => {
  const {user, profile} = useAuth();

  // Mock data
  const [platformButtons, setPlatformButtons] = useState([
    {id: '1', text: 'Google Drive', url: 'https://drive.google.com'},
    {id: '2', text: 'Team Calendar', url: 'https://calendar.google.com'}
  ]);

  // Sample data for other components
  const [users] = useState([
    {id: '1', name: 'John Player', email: 'john@example.com', role: 'player', team: 'U12 Lions'},
    {id: '2', name: 'Sarah Coach', email: 'sarah@example.com', role: 'coach', team: 'U12 Lions'},
    {id: '3', name: 'Mike Parent', email: 'mike@example.com', role: 'parent', children: ['John Player']},
    {id: '4', name: 'Admin User', email: 'admin@academy.com', role: 'admin'}
  ]);

  const [events] = useState([
    {id: '1', title: 'Team Training', date: new Date().toISOString().split('T')[0], time: '16:00', type: 'training', location: 'Main Field'},
    {id: '2', title: 'Match vs Eagles', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '10:00', type: 'match', location: 'Stadium'}
  ]);

  const [payments] = useState([
    {id: '1', studentName: 'John Player', parentName: 'Mike Parent', amount: 120.00, status: 'paid', date: '2024-01-15'},
    {id: '2', studentName: 'Emma Wilson', parentName: 'Lisa Wilson', amount: 120.00, status: 'pending', date: '2024-01-20'}
  ]);

  const [products] = useState([
    {id: '1', name: 'Soccer Ball', price: 25.99, stock: 50, image: 'https://images.unsplash.com/photo-1614632537190-23e4b151b2c3?w=400&h=400&fit=crop', status: 'in-stock'},
    {id: '2', name: 'Team Jersey', price: 45.00, stock: 25, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop', status: 'in-stock'}
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
        button.id === id ? {...button, ...updates} : button
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
    deletePlatformButton,
    
    // Sample data
    users,
    events,
    payments,
    products
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};