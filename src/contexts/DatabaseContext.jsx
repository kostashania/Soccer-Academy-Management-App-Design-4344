import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
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
  const { user, profile } = useAuth();
  const [connections, setConnections] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(null);

  // Check if user has admin access
  const hasAdminAccess = profile?.role === 'admin' || profile?.role === 'super_admin';

  useEffect(() => {
    if (hasAdminAccess) {
      loadDatabaseConnections();
      loadSystemSettings();
    }
  }, [hasAdminAccess]);

  const loadDatabaseConnections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shared.database_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading database connections:', error);
      toast.error('Failed to load database connections');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('shared.system_settings')
        .select('*');

      if (error) throw error;
      
      // Convert array to object for easier access
      const settingsObj = {};
      data?.forEach(setting => {
        if (!settingsObj[setting.setting_category]) {
          settingsObj[setting.setting_category] = {};
        }
        settingsObj[setting.setting_category][setting.setting_key] = setting.setting_value;
      });
      
      setSystemSettings(settingsObj);
    } catch (error) {
      console.error('Error loading system settings:', error);
    }
  };

  const createConnection = async (connectionData) => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      setLoading(true);
      
      // Encrypt password (in production, use proper encryption)
      const encryptedData = {
        ...connectionData,
        password_encrypted: btoa(connectionData.password), // Simple base64 encoding for demo
        created_by: user?.id
      };
      
      delete encryptedData.password; // Remove plain password

      const { data, error } = await supabase
        .from('shared.database_connections')
        .insert(encryptedData)
        .select()
        .single();

      if (error) throw error;

      setConnections(prev => [data, ...prev]);
      toast.success('Database connection created successfully');
      return { success: true, data };
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
      
      const updateData = { ...updates, updated_by: user?.id };
      
      // Encrypt password if provided
      if (updates.password) {
        updateData.password_encrypted = btoa(updates.password);
        delete updateData.password;
      }

      const { data, error } = await supabase
        .from('shared.database_connections')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setConnections(prev => 
        prev.map(conn => conn.id === id ? data : conn)
      );
      
      toast.success('Connection updated successfully');
      return { success: true, data };
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
      const { error } = await supabase
        .from('shared.database_connections')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      
      // Test Supabase connection
      if (connectionData.supabase_url && connectionData.supabase_anon_key) {
        const testSupabase = createClient(
          connectionData.supabase_url,
          connectionData.supabase_anon_key
        );
        
        const { error } = await testSupabase.from('test').select('count').limit(1);
        // We expect an error here if table doesn't exist, but no auth errors
        if (error && error.message.includes('authentication')) {
          throw new Error('Supabase authentication failed');
        }
      }

      // Test API endpoints if provided
      if (connectionData.api_endpoints?.health_check) {
        const response = await fetch(connectionData.api_endpoints.health_check, {
          method: 'GET',
          timeout: 5000
        });
        
        if (!response.ok) {
          throw new Error(`API health check failed: ${response.status}`);
        }
      }

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

  const updateSystemSetting = async (category, key, value, description = '') => {
    if (!hasAdminAccess) {
      toast.error('Unauthorized access');
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('shared.system_settings')
        .upsert({
          setting_category: category,
          setting_key: key,
          setting_value: value,
          description
        }, {
          onConflict: 'setting_category,setting_key'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSystemSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));

      toast.success('System setting updated');
      return { success: true, data };
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
    loadDatabaseConnections,
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