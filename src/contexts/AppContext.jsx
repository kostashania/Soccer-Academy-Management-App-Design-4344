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

  // Mock data - Enhanced users array
  const [users, setUsers] = useState([
    {
      id: '1',
      first_name: 'John',
      last_name: 'Player',
      email: 'john@example.com',
      role: 'player',
      status: 'active',
      phone_number: '+30 123 456 789',
      address: 'Athens, Greece',
      team: 'U12 Lions',
      jersey_number: 10,
      position: 'Forward',
      skill_level: 'intermediate',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      first_name: 'Sarah',
      last_name: 'Coach',
      email: 'sarah@example.com',
      role: 'coach',
      status: 'active',
      phone_number: '+30 123 456 790',
      address: 'Athens, Greece',
      team: 'U12 Lions',
      certification_level: 'UEFA B',
      specialization: 'Youth Development',
      experience_years: 8,
      created_at: '2024-01-10T09:00:00Z'
    },
    {
      id: '3',
      first_name: 'Mike',
      last_name: 'Parent',
      email: 'mike@example.com',
      role: 'parent',
      status: 'active',
      phone_number: '+30 123 456 791',
      address: 'Athens, Greece',
      children: ['John Player'],
      occupation: 'Engineer',
      emergency_contact: '+30 987 654 321',
      created_at: '2024-01-12T11:00:00Z'
    },
    {
      id: '4',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@academy.com',
      role: 'admin',
      status: 'active',
      phone_number: '+30 123 456 792',
      address: 'Athens, Greece',
      created_at: '2024-01-01T08:00:00Z'
    },
    {
      id: '5',
      first_name: 'Nike',
      last_name: 'Sponsor',
      email: 'sponsor@nike.com',
      role: 'sponsor',
      status: 'active',
      phone_number: '+30 123 456 793',
      address: 'Athens, Greece',
      company_name: 'Nike Greece',
      website_url: 'https://nike.com',
      package_type: 'gold',
      created_at: '2024-01-05T14:00:00Z'
    }
  ]);

  // Platform buttons
  const [platformButtons, setPlatformButtons] = useState([
    {id: '1', text: 'Google Drive', url: 'https://drive.google.com'},
    {id: '2', text: 'Team Calendar', url: 'https://calendar.google.com'}
  ]);

  // Sample data for other components
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

  // User management functions
  const addUser = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setUsers(prev => [...prev, newUser]);
      return { success: true, data: newUser };
    } catch (error) {
      throw new Error('Failed to create user: ' + error.message);
    }
  };

  const updateUser = async (id, updates) => {
    try {
      setUsers(prev => 
        prev.map(user => 
          user.id === id 
            ? { ...user, ...updates, updated_at: new Date().toISOString() }
            : user
        )
      );
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update user: ' + error.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== id));
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete user: ' + error.message);
    }
  };

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      byRole: {
        admin: users.filter(u => u.role === 'admin').length,
        coach: users.filter(u => u.role === 'coach').length,
        trainer: users.filter(u => u.role === 'trainer').length,
        parent: users.filter(u => u.role === 'parent').length,
        player: users.filter(u => u.role === 'player').length,
        sponsor: users.filter(u => u.role === 'sponsor').length,
      }
    };
  };

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
    // User management
    users,
    addUser,
    updateUser,
    deleteUser,
    getUserStats,
    
    // Platform buttons
    platformButtons,
    addPlatformButton,
    updatePlatformButton,
    deletePlatformButton,
    
    // Sample data
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