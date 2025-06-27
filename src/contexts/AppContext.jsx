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
      studentChildren: []
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

  // Students Management
  const [students, setStudents] = useState([
    {
      id: '1',
      name: 'Emma Johnson',
      parentId: '3',
      age: 8,
      team: 'K6 Lions',
      position: 'Forward',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  // Locations Management
  const [locations, setLocations] = useState([
    {
      id: '1',
      name: 'Main Stadium',
      address: 'Athens Olympic Stadium, Spyros Louis Ring, Marousi 151 23, Greece',
      googleMapsLink: 'https://maps.google.com/place/Athens+Olympic+Stadium',
      capacity: 5000,
      type: 'stadium'
    },
    {
      id: '2',
      name: 'Training Field A',
      address: 'Academy Training Grounds, Field A',
      googleMapsLink: 'https://maps.google.com/place/Training+Field+A',
      capacity: 200,
      type: 'field'
    }
  ]);

  // Product Categories Management
  const [productCategories, setProductCategories] = useState([
    { id: '1', name: 'Equipment', description: 'Soccer equipment and gear' },
    { id: '2', name: 'Apparel', description: 'Clothing and uniforms' },
    { id: '3', name: 'Accessories', description: 'Soccer accessories' },
    { id: '4', name: 'Nutrition', description: 'Sports nutrition and supplements' }
  ]);

  // Products Management
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Training Jersey',
      category: 'apparel',
      sku: 'TJ-001',
      price: 35.00,
      stock: 45,
      sold: 89,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      status: 'in-stock',
      description: 'Official training jersey for all teams',
      size: 'Multiple',
      customField1: 'Material: 100% Polyester',
      customField2: 'Care: Machine wash cold'
    },
    {
      id: '2',
      name: 'Soccer Boots',
      category: 'equipment',
      sku: 'SB-002',
      price: 85.00,
      stock: 23,
      sold: 67,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop',
      status: 'in-stock',
      description: 'Professional soccer boots for all surfaces',
      size: 'EU 35-45',
      customField1: 'Surface: All terrain',
      customField2: 'Brand: AcademyPro'
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
      locationId: '2',
      type: 'training',
      participants: ['1'],
      coach: 'Sarah Coach',
      description: 'Regular training session'
    }
  ]);

  // Payments Management
  const [payments, setPayments] = useState([
    {
      id: '1',
      studentName: 'Emma Johnson',
      parentName: 'Mike Parent',
      amount: 120.00,
      date: '2024-03-15',
      status: 'paid',
      method: 'card',
      description: 'Monthly subscription - March',
      currency: 'EUR'
    }
  ]);

  // Sponsors Management
  const [sponsors, setSponsors] = useState([
    {
      id: '1',
      name: 'SportTech Solutions',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=100&fit=crop',
      contactEmail: 'contact@sporttech.com',
      amount: 5000.00,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      benefits: 'Logo on jerseys, stadium banner'
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
      status: 'delivered',
      attachments: []
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
      message: 'Payment of €120 received from Mike Parent',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = {
      users: localStorage.getItem('academy_users'),
      students: localStorage.getItem('academy_students'),
      locations: localStorage.getItem('academy_locations'),
      productCategories: localStorage.getItem('academy_categories'),
      products: localStorage.getItem('academy_products'),
      events: localStorage.getItem('academy_events'),
      payments: localStorage.getItem('academy_payments'),
      sponsors: localStorage.getItem('academy_sponsors'),
      conversations: localStorage.getItem('academy_conversations'),
      messages: localStorage.getItem('academy_messages'),
      cart: localStorage.getItem('academy_cart'),
      notifications: localStorage.getItem('academy_notifications')
    };

    Object.entries(savedData).forEach(([key, value]) => {
      if (value) {
        try {
          const parsed = JSON.parse(value);
          switch (key) {
            case 'users': setUsers(parsed); break;
            case 'students': setStudents(parsed); break;
            case 'locations': setLocations(parsed); break;
            case 'productCategories': setProductCategories(parsed); break;
            case 'products': setProducts(parsed); break;
            case 'events': setEvents(parsed); break;
            case 'payments': setPayments(parsed); break;
            case 'sponsors': setSponsors(parsed); break;
            case 'conversations': setConversations(parsed); break;
            case 'messages': setMessages(parsed); break;
            case 'cart': setCartItems(parsed); break;
            case 'notifications': setNotifications(parsed); break;
          }
        } catch (error) {
          console.error(`Error parsing ${key}:`, error);
        }
      }
    });
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('academy_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('academy_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('academy_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('academy_categories', JSON.stringify(productCategories));
  }, [productCategories]);

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
    localStorage.setItem('academy_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

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

  // File upload helper
  const handleFileUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

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

  // Students Management Functions
  const addStudent = (studentData) => {
    const newStudent = {
      id: uuidv4(),
      ...studentData
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (studentId, updates) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, ...updates } : student
    ));
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  // Location Management Functions
  const addLocation = (locationData) => {
    const newLocation = {
      id: uuidv4(),
      ...locationData
    };
    setLocations(prev => [...prev, newLocation]);
    return newLocation;
  };

  const updateLocation = (locationId, updates) => {
    setLocations(prev => prev.map(location => 
      location.id === locationId ? { ...location, ...updates } : location
    ));
  };

  const deleteLocation = (locationId) => {
    setLocations(prev => prev.filter(location => location.id !== locationId));
  };

  // Product Category Management Functions
  const addProductCategory = (categoryData) => {
    const newCategory = {
      id: uuidv4(),
      ...categoryData
    };
    setProductCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateProductCategory = (categoryId, updates) => {
    setProductCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, ...updates } : category
    ));
  };

  const deleteProductCategory = (categoryId) => {
    setProductCategories(prev => prev.filter(category => category.id !== categoryId));
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
      date: new Date().toISOString().split('T')[0],
      currency: 'EUR'
    };
    setPayments(prev => [...prev, newPayment]);
    return newPayment;
  };

  const updatePayment = (paymentId, updates) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId ? { ...payment, ...updates } : payment
    ));
  };

  const deletePayment = (paymentId) => {
    setPayments(prev => prev.filter(payment => payment.id !== paymentId));
  };

  // Sponsor Management Functions
  const addSponsor = (sponsorData) => {
    const newSponsor = {
      id: uuidv4(),
      ...sponsorData
    };
    setSponsors(prev => [...prev, newSponsor]);
    return newSponsor;
  };

  const updateSponsor = (sponsorId, updates) => {
    setSponsors(prev => prev.map(sponsor => 
      sponsor.id === sponsorId ? { ...sponsor, ...updates } : sponsor
    ));
  };

  const deleteSponsor = (sponsorId) => {
    setSponsors(prev => prev.filter(sponsor => sponsor.id !== sponsorId));
  };

  // Message Management Functions
  const sendMessage = (conversationId, senderId, senderName, content, attachments = []) => {
    const newMessage = {
      id: uuidv4(),
      conversationId,
      senderId,
      senderName,
      content,
      attachments,
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

  // Helper functions
  const getLocationById = (locationId) => {
    return locations.find(location => location.id === locationId);
  };

  const getCategoryById = (categoryId) => {
    return productCategories.find(category => category.id === categoryId);
  };

  const getStudentsByParentId = (parentId) => {
    return students.filter(student => student.parentId === parentId);
  };

  const value = {
    // Data
    users,
    students,
    locations,
    productCategories,
    products,
    events,
    payments,
    sponsors,
    conversations,
    messages,
    cartItems,
    notifications,
    unreadNotificationsCount,
    
    // User Management
    addUser,
    updateUser,
    deleteUser,
    
    // Students Management
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentsByParentId,
    
    // Location Management
    addLocation,
    updateLocation,
    deleteLocation,
    getLocationById,
    
    // Product Category Management
    addProductCategory,
    updateProductCategory,
    deleteProductCategory,
    getCategoryById,
    
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
    deletePayment,
    
    // Sponsor Management
    addSponsor,
    updateSponsor,
    deleteSponsor,
    
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
    markAllNotificationsRead,
    
    // File handling
    handleFileUpload
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};