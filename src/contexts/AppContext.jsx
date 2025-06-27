import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Users Management
  const [users, setUsers] = useState([
    {
      id: '1',
      email: 'admin@academy.com',
      name: 'John Admin',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      permissions: ['*'],
      status: 'active',
      joinDate: '2023-01-15',
      phone: '+30 123 456 7890',
      address: 'Athens, Greece'
    },
    {
      id: '2',
      email: 'coach@academy.com',
      name: 'Sarah Coach',
      role: 'coach',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c78d?w=150&h=150&fit=crop&crop=face',
      permissions: ['training', 'attendance', 'players'],
      status: 'active',
      joinDate: '2023-02-01',
      phone: '+30 123 456 7891',
      address: 'Athens, Greece',
      teams: ['K6 Lions', 'K10 Eagles']
    },
    {
      id: '3',
      email: 'parent@academy.com',
      name: 'Mike Parent',
      role: 'parent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      permissions: ['children', 'payments', 'schedule'],
      status: 'active',
      joinDate: '2023-03-01',
      phone: '+30 123 456 7892',
      address: 'Athens, Greece',
      children: ['Emma Johnson', 'Jake Johnson']
    },
    {
      id: '4',
      email: 'player@academy.com',
      name: 'Alex Player',
      role: 'player',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      permissions: ['schedule', 'attendance', 'profile'],
      status: 'active',
      joinDate: '2023-04-01',
      phone: '+30 123 456 7893',
      address: 'Athens, Greece',
      team: 'K10 Eagles',
      position: 'Midfielder'
    }
  ]);

  // Products Management
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Training Jersey',
      category: 'apparel',
      sku: 'TJ-001',
      price: 35,
      stock: 45,
      sold: 89,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      status: 'in-stock',
      description: 'Official training jersey for all teams'
    },
    {
      id: '2',
      name: 'Soccer Boots',
      category: 'equipment',
      sku: 'SB-002',
      price: 85,
      stock: 23,
      sold: 67,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop',
      status: 'in-stock',
      description: 'Professional soccer boots for all surfaces'
    },
    {
      id: '3',
      name: 'Soccer Ball',
      category: 'equipment',
      sku: 'SB-004',
      price: 45,
      stock: 5,
      sold: 234,
      image: 'https://images.unsplash.com/photo-1614632537190-23e4b2efe8c0?w=300&h=300&fit=crop',
      status: 'low-stock',
      description: 'FIFA approved soccer ball'
    }
  ]);

  // Events Management
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'K6 Lions Training',
      date: new Date(),
      time: '16:00',
      duration: 90,
      location: 'Field A',
      type: 'training',
      participants: ['Emma Johnson'],
      coach: 'Sarah Coach',
      description: 'Regular training session'
    },
    {
      id: '2',
      title: 'K10 Eagles vs Blue Stars',
      date: new Date(Date.now() + 86400000),
      time: '10:00',
      duration: 90,
      location: 'Main Stadium',
      type: 'match',
      participants: ['Alex Player'],
      coach: 'Sarah Coach',
      description: 'Championship match'
    }
  ]);

  // Payments Management
  const [payments, setPayments] = useState([
    {
      id: '1',
      studentName: 'Emma Johnson',
      parentName: 'Mike Johnson',
      amount: 120,
      date: '2024-03-15',
      status: 'paid',
      method: 'card',
      description: 'Monthly subscription - March'
    },
    {
      id: '2',
      studentName: 'Alex Smith',
      parentName: 'Sarah Smith',
      amount: 85,
      date: '2024-03-14',
      status: 'paid',
      method: 'bank',
      description: 'Equipment purchase'
    }
  ]);

  // Messages Management
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'Sarah Coach',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c78d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Training session moved to 5 PM tomorrow',
      time: '2 hours ago',
      unread: 2,
      online: true,
      type: 'individual',
      participants: ['1', '2']
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      conversationId: '1',
      senderId: '2',
      senderName: 'Sarah Coach',
      content: 'Hi! Training session has been moved to 5 PM tomorrow.',
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }
  ]);

  // Cart Management
  const [cartItems, setCartItems] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of €120 received from Mike Johnson',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'training',
      title: 'Training Scheduled',
      message: 'New training session scheduled for K10 team',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('academy_users');
    const savedProducts = localStorage.getItem('academy_products');
    const savedEvents = localStorage.getItem('academy_events');
    const savedPayments = localStorage.getItem('academy_payments');
    const savedConversations = localStorage.getItem('academy_conversations');
    const savedMessages = localStorage.getItem('academy_messages');
    const savedCart = localStorage.getItem('academy_cart');
    const savedNotifications = localStorage.getItem('academy_notifications');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedConversations) setConversations(JSON.parse(savedConversations));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('academy_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('academy_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('academy_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('academy_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('academy_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('academy_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('academy_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('academy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // User Management Functions
  const addUser = (userData) => {
    const newUser = {
      id: uuidv4(),
      ...userData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Product Management Functions
  const addProduct = (productData) => {
    const newProduct = {
      id: uuidv4(),
      ...productData,
      sold: 0,
      status: productData.stock > 10 ? 'in-stock' : productData.stock > 0 ? 'low-stock' : 'out-of-stock'
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  // Event Management Functions
  const addEvent = (eventData) => {
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      participants: eventData.participants || []
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Payment Management Functions
  const addPayment = (paymentData) => {
    const newPayment = {
      id: uuidv4(),
      ...paymentData,
      date: new Date().toISOString().split('T')[0]
    };
    setPayments(prev => [...prev, newPayment]);
    return newPayment;
  };

  const updatePayment = (paymentId, updates) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId ? { ...payment, ...updates } : payment
    ));
  };

  // Message Management Functions
  const sendMessage = (conversationId, senderId, senderName, content) => {
    const newMessage = {
      id: uuidv4(),
      conversationId,
      senderId,
      senderName,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: content, time: 'now' }
        : conv
    ));
    
    return newMessage;
  };

  const createConversation = (participants, name, type = 'individual') => {
    const newConversation = {
      id: uuidv4(),
      name,
      participants,
      type,
      lastMessage: '',
      time: 'now',
      unread: 0,
      online: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };
    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  };

  // Cart Management Functions
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Notification Management
  const addNotification = (notification) => {
    const newNotification = {
      id: uuidv4(),
      ...notification,
      time: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const value = {
    // Data
    users,
    products,
    events,
    payments,
    conversations,
    messages,
    cartItems,
    notifications,
    unreadNotificationsCount,
    
    // User Management
    addUser,
    updateUser,
    deleteUser,
    
    // Product Management
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Event Management
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Payment Management
    addPayment,
    updatePayment,
    
    // Message Management
    sendMessage,
    createConversation,
    
    // Cart Management
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    
    // Notification Management
    addNotification,
    markNotificationRead,
    markAllNotificationsRead
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};