import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  userService, 
  paymentService, 
  storeService, 
  eventService, 
  messageService,
  sponsorService,
  notificationService,
  settingsService,
  analyticsService
} from '../services/supabaseService';
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
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [sponsorPackages, setSponsorPackages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadInitialData();
    }
  }, [isAuthenticated, user]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadPayments(),
        loadProducts(),
        loadEvents(),
        loadLocations(),
        loadCartItems(),
        loadNotifications(),
        loadDashboardStats()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // 👥 USER MANAGEMENT
  // ========================================

  const loadUsers = async () => {
    try {
      const { data, error } = await userService.getUsers();
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const addUser = async (userData) => {
    try {
      const { data, error } = await userService.createUser(userData);
      if (error) throw error;
      
      setUsers(prev => [data, ...prev]);
      toast.success('User created successfully!');
      return data;
    } catch (error) {
      toast.error('Error creating user');
      throw error;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const { data, error } = await userService.updateUser(id, updates);
      if (error) throw error;
      
      setUsers(prev => prev.map(user => user.id === id ? data : user));
      toast.success('User updated successfully!');
      return data;
    } catch (error) {
      toast.error('Error updating user');
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const { error } = await userService.deleteUser(id);
      if (error) throw error;
      
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully!');
    } catch (error) {
      toast.error('Error deleting user');
      throw error;
    }
  };

  // ========================================
  // 💰 PAYMENT MANAGEMENT
  // ========================================

  const loadPayments = async () => {
    try {
      const { data, error } = await paymentService.getPayments();
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const addPayment = async (paymentData) => {
    try {
      const { data, error } = await paymentService.createPayment({
        ...paymentData,
        created_by: user.id
      });
      if (error) throw error;
      
      setPayments(prev => [data, ...prev]);
      toast.success('Payment created successfully!');
      return data;
    } catch (error) {
      toast.error('Error creating payment');
      throw error;
    }
  };

  const updatePayment = async (id, updates) => {
    try {
      const { data, error } = await paymentService.updatePayment(id, updates);
      if (error) throw error;
      
      setPayments(prev => prev.map(payment => payment.id === id ? data : payment));
      toast.success('Payment updated successfully!');
      return data;
    } catch (error) {
      toast.error('Error updating payment');
      throw error;
    }
  };

  const deletePayment = async (id) => {
    try {
      const { error } = await paymentService.deletePayment(id);
      if (error) throw error;
      
      setPayments(prev => prev.filter(payment => payment.id !== id));
      toast.success('Payment deleted successfully!');
    } catch (error) {
      toast.error('Error deleting payment');
      throw error;
    }
  };

  // ========================================
  // 🛒 STORE MANAGEMENT
  // ========================================

  const loadProducts = async () => {
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        storeService.getProducts(),
        storeService.getCategories()
      ]);
      
      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      
      setProducts(productsResult.data || []);
      setProductCategories(categoriesResult.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addProduct = async (productData) => {
    try {
      const { data, error } = await storeService.createProduct({
        ...productData,
        created_by: user.id
      });
      if (error) throw error;
      
      setProducts(prev => [data, ...prev]);
      toast.success('Product created successfully!');
      return data;
    } catch (error) {
      toast.error('Error creating product');
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const { data, error } = await storeService.updateProduct(id, updates);
      if (error) throw error;
      
      setProducts(prev => prev.map(product => product.id === id ? data : product));
      toast.success('Product updated successfully!');
      return data;
    } catch (error) {
      toast.error('Error updating product');
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await storeService.deleteProduct(id);
      if (error) throw error;
      
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Error deleting product');
      throw error;
    }
  };

  // Cart management
  const loadCartItems = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await storeService.getCartItems(user.id);
      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const { error } = await storeService.addToCart(user.id, product.id, quantity);
      if (error) throw error;
      
      await loadCartItems();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Error adding to cart');
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const { error } = await storeService.updateCartItem(user.id, productId, quantity);
      if (error) throw error;
      
      await loadCartItems();
    } catch (error) {
      toast.error('Error updating cart');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await storeService.clearCart(user.id);
      if (error) throw error;
      
      setCartItems([]);
      toast.success('Cart cleared!');
    } catch (error) {
      toast.error('Error clearing cart');
      throw error;
    }
  };

  // ========================================
  // 📅 EVENT MANAGEMENT
  // ========================================

  const loadEvents = async () => {
    try {
      const { data, error } = await eventService.getEvents();
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const { data, error } = await eventService.getLocations();
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const addEvent = async (eventData) => {
    try {
      const { data, error } = await eventService.createEvent({
        ...eventData,
        created_by: user.id
      });
      if (error) throw error;
      
      setEvents(prev => [data, ...prev]);
      toast.success('Event created successfully!');
      return data;
    } catch (error) {
      toast.error('Error creating event');
      throw error;
    }
  };

  const updateEvent = async (id, updates) => {
    try {
      const { data, error } = await eventService.updateEvent(id, updates);
      if (error) throw error;
      
      setEvents(prev => prev.map(event => event.id === id ? data : event));
      toast.success('Event updated successfully!');
      return data;
    } catch (error) {
      toast.error('Error updating event');
      throw error;
    }
  };

  const deleteEvent = async (id) => {
    try {
      const { error } = await eventService.deleteEvent(id);
      if (error) throw error;
      
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully!');
    } catch (error) {
      toast.error('Error deleting event');
      throw error;
    }
  };

  // ========================================
  // 🔔 NOTIFICATIONS
  // ========================================

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await notificationService.getNotifications(user.id);
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      const { error } = await notificationService.markAsRead(id);
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read_status: true } : notif)
      );
    } catch (error) {
      toast.error('Error marking notification as read');
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const { error } = await notificationService.markAllAsRead(user.id);
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read_status: true }))
      );
    } catch (error) {
      toast.error('Error marking all notifications as read');
    }
  };

  // ========================================
  // 📊 DASHBOARD STATS
  // ========================================

  const loadDashboardStats = async () => {
    try {
      const stats = await analyticsService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  // Helper functions
  const getLocationById = (id) => {
    return locations.find(location => location.id === id);
  };

  const getCategoryById = (id) => {
    return productCategories.find(category => category.id === id);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read_status).length;

  const value = {
    // Data
    users,
    payments,
    products,
    productCategories,
    events,
    locations,
    cartItems,
    conversations,
    messages,
    sponsors,
    sponsorPackages,
    notifications,
    dashboardStats,
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