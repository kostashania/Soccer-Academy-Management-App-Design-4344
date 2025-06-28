import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useDatabase } from '../../contexts/DatabaseContext';
import { toast } from 'react-toastify';

const {
  FiDatabase,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTestTube,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiServer,
  FiKey,
  FiGlobe,
  FiSettings,
  FiCheck,
  FiAlertTriangle,
  FiRefreshCw
} = FiIcons;

const DatabaseManagement = () => {
  const {
    connections,
    systemSettings,
    loading,
    testingConnection,
    hasAdminAccess,
    createConnection,
    updateConnection,
    deleteConnection,
    testConnection,
    updateSystemSetting
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('connections');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [connectionForm, setConnectionForm] = useState({
    connection_name: '',
    app_schema: 'academies',
    host: 'localhost',
    port: 5432,
    database_name: '',
    username: '',
    password: '',
    supabase_url: '',
    supabase_anon_key: '',
    supabase_service_key: '',
    api_endpoints: {
      health_check: '',
      auth: '',
      data: ''
    },
    connection_config: {
      ssl: true,
      timeout: 30,
      pool_size: 10
    },
    status: 'active'
  });

  const [settingsForm, setSettingsForm] = useState({
    category: '',
    key: '',
    value: '',
    description: ''
  });

  if (!hasAdminAccess) {
    return (
      <div className="p-6 text-center">
        <SafeIcon icon={FiAlertTriangle} className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-600">You need admin privileges to access database management.</p>
      </div>
    );
  }

  const handleConnectionSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingConnection) {
        await updateConnection(editingConnection.id, connectionForm);
      } else {
        await createConnection(connectionForm);
      }
      
      setShowConnectionModal(false);
      setEditingConnection(null);
      resetConnectionForm();
    } catch (error) {
      console.error('Error saving connection:', error);
    }
  };

  const handleEditConnection = (connection) => {
    setEditingConnection(connection);
    setConnectionForm({
      ...connection,
      password: '', // Don't pre-fill password for security
      api_endpoints: connection.api_endpoints || {
        health_check: '',
        auth: '',
        data: ''
      },
      connection_config: connection.connection_config || {
        ssl: true,
        timeout: 30,
        pool_size: 10
      }
    });
    setShowConnectionModal(true);
  };

  const handleDeleteConnection = async (id) => {
    if (window.confirm('Are you sure you want to delete this database connection?')) {
      await deleteConnection(id);
    }
  };

  const handleTestConnection = async (connection) => {
    await testConnection(connection);
  };

  const resetConnectionForm = () => {
    setConnectionForm({
      connection_name: '',
      app_schema: 'academies',
      host: 'localhost',
      port: 5432,
      database_name: '',
      username: '',
      password: '',
      supabase_url: '',
      supabase_anon_key: '',
      supabase_service_key: '',
      api_endpoints: {
        health_check: '',
        auth: '',
        data: ''
      },
      connection_config: {
        ssl: true,
        timeout: 30,
        pool_size: 10
      },
      status: 'active'
    });
  };

  const togglePasswordVisibility = (fieldId) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSchemaColor = (schema) => {
    switch (schema) {
      case 'academies': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'shared': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'connections', name: 'Database Connections', icon: FiDatabase },
    { id: 'settings', name: 'System Settings', icon: FiSettings },
    { id: 'schemas', name: 'Schema Overview', icon: FiServer }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
          <p className="text-gray-600 mt-1">Manage database connections and system settings</p>
        </div>
        {activeTab === 'connections' && (
          <button
            onClick={() => setShowConnectionModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
            Add Connection
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={tab.icon} className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Database Connections Tab */}
        {activeTab === 'connections' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Connections</h3>
            
            {connections.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiDatabase} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No database connections configured yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiDatabase} className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{connection.connection_name}</h4>
                          <p className="text-sm text-gray-500">
                            {connection.host}:{connection.port}/{connection.database_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getSchemaColor(connection.app_schema)}`}>
                          {connection.app_schema}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(connection.status)}`}>
                          {connection.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Username</p>
                        <p className="text-sm font-medium">{connection.username}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-sm font-medium">
                          {new Date(connection.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {connection.supabase_url && (
                        <div>
                          <p className="text-xs text-gray-500">Supabase URL</p>
                          <p className="text-sm font-medium truncate">{connection.supabase_url}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestConnection(connection)}
                        disabled={testingConnection === connection.connection_name}
                        className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50"
                      >
                        <SafeIcon 
                          icon={testingConnection === connection.connection_name ? FiRefreshCw : FiTestTube} 
                          className={`h-3 w-3 mr-1 ${testingConnection === connection.connection_name ? 'animate-spin' : ''}`} 
                        />
                        {testingConnection === connection.connection_name ? 'Testing...' : 'Test'}
                      </button>
                      <button
                        onClick={() => handleEditConnection(connection)}
                        className="flex items-center px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiEdit2} className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteConnection(connection.id)}
                        className="flex items-center px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        <SafeIcon icon={FiTrash2} className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            
            <div className="space-y-6">
              {Object.entries(systemSettings).map(([category, settings]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize">{category} Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{key}</p>
                          <p className="text-xs text-gray-500">{JSON.stringify(value)}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schema Overview Tab */}
        {activeTab === 'schemas' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Schema Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiDatabase} className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Academies Schema</h4>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Core academy management: users, teams, players, events, store
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-blue-600">• user_profiles_sa2025</p>
                  <p className="text-xs text-blue-600">• teams_sa2025</p>
                  <p className="text-xs text-blue-600">• player_profiles_sa2025</p>
                  <p className="text-xs text-blue-600">• events_sa2025</p>
                  <p className="text-xs text-blue-600">• products_sa2025</p>
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiDatabase} className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Financial Schema</h4>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Financial operations: payments, invoices, transactions
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-green-600">• payments_sa2025</p>
                  <p className="text-xs text-green-600">• invoices_sa2025</p>
                  <p className="text-xs text-green-600">• transactions_sa2025</p>
                  <p className="text-xs text-green-600">• fee_structures_sa2025</p>
                </div>
              </div>

              <div className="border border-purple-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiDatabase} className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium text-purple-900">Shared Schema</h4>
                </div>
                <p className="text-sm text-purple-700 mb-3">
                  Cross-app shared resources and system configuration
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-purple-600">• database_connections</p>
                  <p className="text-xs text-purple-600">• system_settings</p>
                  <p className="text-xs text-purple-600">• cross_app_audit_log</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowConnectionModal(false)} />
            
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingConnection ? 'Edit Database Connection' : 'Add Database Connection'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowConnectionModal(false);
                      setEditingConnection(null);
                      resetConnectionForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleConnectionSubmit} className="p-6 space-y-6">
                {/* Basic Connection Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connection Name *
                    </label>
                    <input
                      type="text"
                      value={connectionForm.connection_name}
                      onChange={(e) => setConnectionForm({...connectionForm, connection_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Schema *
                    </label>
                    <select
                      value={connectionForm.app_schema}
                      onChange={(e) => setConnectionForm({...connectionForm, app_schema: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="academies">Academies</option>
                      <option value="financial">Financial</option>
                      <option value="shared">Shared</option>
                    </select>
                  </div>
                </div>

                {/* Database Connection Details */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Database Connection</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Host *</label>
                      <input
                        type="text"
                        value={connectionForm.host}
                        onChange={(e) => setConnectionForm({...connectionForm, host: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
                      <input
                        type="number"
                        value={connectionForm.port}
                        onChange={(e) => setConnectionForm({...connectionForm, port: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Database Name *</label>
                      <input
                        type="text"
                        value={connectionForm.database_name}
                        onChange={(e) => setConnectionForm({...connectionForm, database_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                      <input
                        type="text"
                        value={connectionForm.username}
                        onChange={(e) => setConnectionForm({...connectionForm, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password {editingConnection ? '' : '*'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.password ? "text" : "password"}
                          value={connectionForm.password}
                          onChange={(e) => setConnectionForm({...connectionForm, password: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required={!editingConnection}
                          placeholder={editingConnection ? "Leave blank to keep current" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('password')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <SafeIcon icon={showPasswords.password ? FiEyeOff : FiEye} className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supabase Configuration */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Supabase Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supabase URL</label>
                      <input
                        type="url"
                        value={connectionForm.supabase_url}
                        onChange={(e) => setConnectionForm({...connectionForm, supabase_url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supabase Anon Key</label>
                      <div className="relative">
                        <input
                          type={showPasswords.anon_key ? "text" : "password"}
                          value={connectionForm.supabase_anon_key}
                          onChange={(e) => setConnectionForm({...connectionForm, supabase_anon_key: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('anon_key')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <SafeIcon icon={showPasswords.anon_key ? FiEyeOff : FiEye} className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supabase Service Key</label>
                      <div className="relative">
                        <input
                          type={showPasswords.service_key ? "text" : "password"}
                          value={connectionForm.supabase_service_key}
                          onChange={(e) => setConnectionForm({...connectionForm, supabase_service_key: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('service_key')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <SafeIcon icon={showPasswords.service_key ? FiEyeOff : FiEye} className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* API Endpoints */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">API Endpoints</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Health Check URL</label>
                      <input
                        type="url"
                        value={connectionForm.api_endpoints.health_check}
                        onChange={(e) => setConnectionForm({
                          ...connectionForm,
                          api_endpoints: {...connectionForm.api_endpoints, health_check: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://api.example.com/health"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Auth API URL</label>
                      <input
                        type="url"
                        value={connectionForm.api_endpoints.auth}
                        onChange={(e) => setConnectionForm({
                          ...connectionForm,
                          api_endpoints: {...connectionForm.api_endpoints, auth: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://api.example.com/auth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data API URL</label>
                      <input
                        type="url"
                        value={connectionForm.api_endpoints.data}
                        onChange={(e) => setConnectionForm({
                          ...connectionForm,
                          api_endpoints: {...connectionForm.api_endpoints, data: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://api.example.com/data"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={connectionForm.status}
                        onChange={(e) => setConnectionForm({...connectionForm, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="testing">Testing</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowConnectionModal(false);
                      setEditingConnection(null);
                      resetConnectionForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    <SafeIcon icon={FiSave} className="h-4 w-4 mr-2 inline" />
                    {editingConnection ? 'Update Connection' : 'Create Connection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManagement;