import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    const translations = {
      en: {
        // Navigation
        dashboard: 'Dashboard',
        calendar: 'Calendar',
        payments: 'Payments',
        store: 'Store',
        messages: 'Messages',
        profile: 'Profile',
        
        // Common
        welcome: 'Welcome',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        filter: 'Filter',
        
        // Auth
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        
        // Dashboard
        overview: 'Overview',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        
        // Payments
        totalRevenue: 'Total Revenue',
        outstandingBalance: 'Outstanding Balance',
        paidThisMonth: 'Paid This Month',
        
        // Store
        inventory: 'Inventory',
        lowStock: 'Low Stock',
        bestSellers: 'Best Sellers',
        
        // Calendar
        upcomingEvents: 'Upcoming Events',
        training: 'Training',
        match: 'Match',
        
        // Messages
        newMessage: 'New Message',
        inbox: 'Inbox',
        sent: 'Sent',
      },
      gr: {
        // Navigation
        dashboard: 'Πίνακας Ελέγχου',
        calendar: 'Ημερολόγιο',
        payments: 'Πληρωμές',
        store: 'Κατάστημα',
        messages: 'Μηνύματα',
        profile: 'Προφίλ',
        
        // Common
        welcome: 'Καλώς ήρθες',
        loading: 'Φόρτωση...',
        save: 'Αποθήκευση',
        cancel: 'Ακύρωση',
        delete: 'Διαγραφή',
        edit: 'Επεξεργασία',
        add: 'Προσθήκη',
        search: 'Αναζήτηση',
        filter: 'Φίλτρο',
        
        // Auth
        login: 'Σύνδεση',
        logout: 'Αποσύνδεση',
        email: 'Email',
        password: 'Κωδικός',
        
        // Dashboard
        overview: 'Επισκόπηση',
        recentActivity: 'Πρόσφατη Δραστηριότητα',
        quickActions: 'Γρήγορες Ενέργειες',
        
        // Payments
        totalRevenue: 'Συνολικά Έσοδα',
        outstandingBalance: 'Εκκρεμείς Οφειλές',
        paidThisMonth: 'Πληρωμές Αυτού του Μήνα',
        
        // Store
        inventory: 'Απόθεμα',
        lowStock: 'Χαμηλό Απόθεμα',
        bestSellers: 'Καλύτερες Πωλήσεις',
        
        // Calendar
        upcomingEvents: 'Επερχόμενα Γεγονότα',
        training: 'Προπόνηση',
        match: 'Αγώνας',
        
        // Messages
        newMessage: 'Νέο Μήνυμα',
        inbox: 'Εισερχόμενα',
        sent: 'Απεσταλμένα',
      }
    };
    
    return translations[language]?.[key] || key;
  };

  const value = {
    theme,
    language,
    toggleTheme,
    changeLanguage,
    t
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};