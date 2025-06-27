import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext({});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Mock Data
  const [users] = useState([
    { id: '1', name: 'John Player', email: 'john@example.com', role: 'player', team: 'U12 Lions' },
    { id: '2', name: 'Sarah Coach', email: 'sarah@example.com', role: 'coach', team: 'U12 Lions' },
    { id: '3', name: 'Mike Parent', email: 'mike@example.com', role: 'parent', children: ['John Player'] },
    { id: '4', name: 'Admin User', email: 'admin@academy.com', role: 'admin' }
  ]);

  const [events] = useState([
    {
      id: '1',
      title: 'Team Training',
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      type: 'training',
      location: 'Main Field'
    },
    {
      id: '2',
      title: 'Match vs Eagles',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00',
      type: 'match',
      location: 'Stadium'
    }
  ]);

  const [payments] = useState([
    {
      id: '1',
      studentName: 'John Player',
      parentName: 'Mike Parent',
      amount: 120.00,
      status: 'paid',
      date: '2024-01-15'
    },
    {
      id: '2',
      studentName: 'Emma Wilson',
      parentName: 'Lisa Wilson',
      amount: 120.00,
      status: 'pending',
      date: '2024-01-20'
    }
  ]);

  const [products] = useState([
    {
      id: '1',
      name: 'Soccer Ball',
      price: 25.99,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1614632537190-23e4b151b2c3?w=400&h=400&fit=crop',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Team Jersey',
      price: 45.00,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      status: 'in-stock'
    }
  ]);

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    users,
    events,
    payments,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};