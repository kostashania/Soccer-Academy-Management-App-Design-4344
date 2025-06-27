import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
  const { user, isAuthenticated } = useAuth();

  // State
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data to prevent blank pages
  const initializeMockData = () => {
    console.log('Initializing mock data...');
    
    // Mock users
    setUsers([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'player',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'parent',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    ]);

    // Mock students (same as users for now)
    setStudents([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'player',
        parentId: '2',
        parentName: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    ]);

    // Mock products
    setProducts([
      {
        id: '1',
        name: 'Soccer Ball',
        price: 25.99,
        stock: 50,
        sku: 'SB001',
        category: 'equipment',
        image: 'https://images.unsplash.com/photo-1614632537190-23e4b151b2c3?w=400&h=400&fit=crop',
        status: 'in-stock',
        sold: 10
      },
      {
        id: '2',
        name: 'Team Jersey',
        price: 45.00,
        stock: 25,
        sku: 'TJ001',
        category: 'apparel',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        status: 'in-stock',
        sold: 15
      }
    ]);

    // Mock categories
    setProductCategories([
      { id: '1', name: 'Equipment' },
      { id: '2', name: 'Apparel' },
      { id: '3', name: 'Accessories' }
    ]);

    // Mock events
    setEvents([
      {
        id: '1',
        title: 'Team Training',
        date: new Date().toISOString().split('T')[0],
        time: '16:00',
        duration: 90,
        type: 'training',
        locationId: '1',
        participants: ['John Doe'],
        coach: 'Sarah Coach'
      }
    ]);

    // Mock locations
    setLocations([
      {
        id: '1',
        name: 'Main Field',
        address: 'Soccer Academy, Athens',
        googleMapsLink: 'https://maps.google.com'
      }
    ]);

    // Mock payments
    setPayments([
      {
        id: '1',
        studentName: 'John Doe',
        parentName: 'Jane Smith',
        amount: 120.00,
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
        method: 'card'
      }
    ]);

    // Mock conversations
    setConversations([
      {
        id: '1',
        name: 'General Chat',
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
        lastMessage: 'Welcome to the academy!',
        time: 'now',
        unread: 0,
        type: 'room'
      }
    ]);

    // Mock messages
    setMessages([
      {
        id: '1',
        conversationId: '1',
        senderId: '1',
        senderName: 'Admin',
        content: 'Welcome to the Soccer Academy!',
        timestamp: new Date().toISOString(),
        status: 'read'
      }
    ]);

    console.log('Mock data initialized');
  };

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User authenticated, loading data for:', user.email);
      loadInitialData();
    }
  }, [isAuthenticated, user]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.log('Loading initial data...');
      
      // Try to load real data, fall back to mock data if it fails
      try {
        await Promise.all([
          loadUsers(),
          loadPayments(),
          loadProducts(),
          loadEvents(),
          loadLocations()
        ]);
        console.log('Real data loaded successfully');
      } catch (error) {
        console.warn('Failed to load real data, using mock data:', error);
        initializeMockData();
      }
    } catch (error) {
      console.error('Error in loadInitialData:', error);
      // Always fall back to mock data
      initializeMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_sa2025')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      // Keep existing mock data
    }
  };

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments_sa2025')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      // Keep existing mock data
    }
  };

  const loadProducts = async () => {
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products_sa2025')
        .select('*')
        .order('created_at', { ascending: false });
        
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories_sa2025')
        .select('*')
        .order('name');
      
      if (productsError) throw productsError;
      if (categoriesError) throw categoriesError;
      
      setProducts(productsData || []);
      setProductCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading products:', error);
      // Keep existing mock data
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events_sa2025')
        .select('*')
        .order('date_time', { ascending: true });
        
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      // Keep existing mock data
    }
  };

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations_sa2025')
        .select('*')
        .eq('active_status', true)
        .order('name');
        
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
      // Keep existing mock data
    }
  };

  // Cart management
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Mock functions for missing features
  const addUser = (userData) => {
    const newUser = { ...userData, id: Date.now().toString() };
    setUsers(prev => [newUser, ...prev]);
    return Promise.resolve(newUser);
  };

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
    return Promise.resolve(updates);
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    return Promise.resolve();
  };

  const addPayment = (paymentData) => {
    const newPayment = { ...paymentData, id: Date.now().toString() };
    setPayments(prev => [newPayment, ...prev]);
    return Promise.resolve(newPayment);
  };

  const updatePayment = (id, updates) => {
    setPayments(prev => prev.map(payment => payment.id === id ? { ...payment, ...updates } : payment));
    return Promise.resolve(updates);
  };

  const deletePayment = (id) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
    return Promise.resolve();
  };

  const addProduct = (productData) => {
    const newProduct = { ...productData, id: Date.now().toString() };
    setProducts(prev => [newProduct, ...prev]);
    return Promise.resolve(newProduct);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(product => product.id === id ? { ...product, ...updates } : product));
    return Promise.resolve(updates);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    return Promise.resolve();
  };

  const addEvent = (eventData) => {
    const newEvent = { ...eventData, id: Date.now().toString() };
    setEvents(prev => [newEvent, ...prev]);
    return Promise.resolve(newEvent);
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(event => event.id === id ? { ...event, ...updates } : event));
    return Promise.resolve(updates);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    return Promise.resolve();
  };

  // Helper functions
  const getLocationById = (id) => {
    return locations.find(location => location.id === id);
  };

  const getCategoryById = (id) => {
    return productCategories.find(category => category.id === id);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read_status: true } : notif
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read_status: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read_status).length;

  const value = {
    // Data
    users,
    students,
    payments,
    products,
    productCategories,
    events,
    locations,
    cartItems,
    conversations,
    messages,
    notifications,
    loading,

    // User Management
    addUser,
    updateUser,
    deleteUser,

    // Payment Management
    addPayment,
    updatePayment,
    deletePayment,

    // Store Management
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,

    // Event Management
    addEvent,
    updateEvent,
    deleteEvent,

    // Notifications
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,

    // Helpers
    getLocationById,
    getCategoryById,

    // Reload functions
    loadInitialData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};