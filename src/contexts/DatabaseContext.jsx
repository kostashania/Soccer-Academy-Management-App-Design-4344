import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const DatabaseContext = createContext({});

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const { profile } = useAuth();
  const [connections, setConnections] = useState([
    {
      id: '1',
      connection_name: 'Main Academy DB',
      app_schema: 'academies',
      host: 'localhost',
      port: 5432,
      database_name: 'sports_academy',
      username: 'admin',
      supabase_url: 'https://demo.supabase.co',
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      connection_name: 'Financial DB',
      app_schema: 'financial',
      host: 'localhost',
      port: 5432,
      database_name: 'financial_app',
      username: 'finance_admin',
      supabase_url: 'https://finance.supabase.co',
      status: 'active',
      created_at: new Date().toISOString()
    }
  ]);
  
  const [systemSettings, setSystemSettings] = useState({
    app: {
      multi_schema_enabled: true,
      default_currency: 'EUR'
    },
    security: {
      session_timeout: 3600
    },
    financial: {
      tax_rate: 0.24
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(null);

  // Check if user has admin access
  const hasAdminAccess = profile?.role === 'admin' || profile?.role === 'super_admin';

  const createConnection = async (connectionData) => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      setLoading(true);
      
      const newConnection = {
        id: Date.now().toString(),
        ...connectionData,
        created_at: new Date().toISOString()
      };
      
      setConnections(prev => [newConnection, ...prev]);
      toast.success('Database connection created successfully');
      return { success: true, data: newConnection };
    } catch (error) {
      console.error('Error creating connection:', error);
      toast.error('Failed to create database connection');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateConnection = async (id, updates) => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      setLoading(true);
      
      setConnections(prev => 
        prev.map(conn => 
          conn.id === id 
            ? { ...conn, ...updates, updated_at: new Date().toISOString() }
            : conn
        )
      );
      
      toast.success('Connection updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update connection');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteConnection = async (id) => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      setLoading(true);
      setConnections(prev => prev.filter(conn => conn.id !== id));
      toast.success('Connection deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast.error('Failed to delete connection');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (connectionData) => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      setTestingConnection(connectionData.connection_name);
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Connection test successful');
      return { success: true };
    } catch (error) {
      console.error('Connection test failed:', error);
      toast.error(`Connection test failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setTestingConnection(null);
    }
  };

  const updateSystemSetting = async (category, key, value) => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      setSystemSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));

      toast.success('System setting updated');
      return { success: true };
    } catch (error) {
      console.error('Error updating system setting:', error);
      toast.error('Failed to update system setting');
      return { success: false, error: error.message };
    }
  };

  const getConnectionsBySchema = (schema) => {
    return connections.filter(conn => conn.app_schema === schema);
  };

  const getActiveConnections = () => {
    return connections.filter(conn => conn.status === 'active');
  };

  const value = {
    // Data
    connections,
    systemSettings,
    loading,
    testingConnection,
    hasAdminAccess,

    // Functions
    createConnection,
    updateConnection,
    deleteConnection,
    testConnection,
    updateSystemSetting,
    getConnectionsBySchema,
    getActiveConnections
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};