import React, {useState} from 'react';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import {toast} from 'react-toastify';

const {FiDatabase, FiCopy, FiEye, FiEyeOff, FiServer, FiKey, FiLock, FiCode, FiBook} = FiIcons;

const DatabaseInfo = () => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Database connection information
  const dbInfo = {
    host: 'db.your-project.supabase.co',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: '[Your Database Password]',
    supabaseUrl: 'https://your-project.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  };

  const schemas = [
    {
      name: 'academies',
      description: 'Core academy management: users, teams, events, store',
      tables: [
        'user_profiles_sa2025',
        'teams_sa2025', 
        'player_profiles_sa2025',
        'coach_profiles_sa2025',
        'parent_profiles_sa2025',
        'events_sa2025',
        'products_sa2025',
        'locations_sa2025'
      ]
    },
    {
      name: 'financial',
      description: 'Financial operations: payments, invoices, transactions',
      tables: [
        'payments_sa2025',
        'invoices_sa2025',
        'transactions_sa2025',
        'fee_structures_sa2025'
      ]
    },
    {
      name: 'shared',
      description: 'Cross-app shared resources and system configuration',
      tables: [
        'database_connections',
        'system_settings',
        'cross_app_audit_log'
      ]
    }
  ];

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const connectionExamples = {
    javascript: `// Supabase JavaScript Client
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '${dbInfo.supabaseUrl}'
const supabaseKey = '${dbInfo.anonKey}'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'academies' } // or 'financial', 'shared'
})

// Query example
const { data, error } = await supabase
  .from('user_profiles_sa2025')
  .select('*')
  .eq('role', 'player')`,

    python: `# Python with supabase-py
from supabase import create_client, Client

url: str = "${dbInfo.supabaseUrl}"
key: str = "${dbInfo.anonKey}"
supabase: Client = create_client(url, key)

# Query example
response = supabase.table('user_profiles_sa2025').select('*').eq('role', 'player').execute()`,

    postgresql: `-- Direct PostgreSQL Connection
Host: ${dbInfo.host}
Port: ${dbInfo.port}
Database: ${dbInfo.database}
Username: ${dbInfo.username}
Password: ${dbInfo.password}

-- Example query
SELECT * FROM academies.user_profiles_sa2025 WHERE role = 'player';`,

    rest: `// REST API Example
const response = await fetch('${dbInfo.supabaseUrl}/rest/v1/user_profiles_sa2025?role=eq.player', {
  headers: {
    'apikey': '${dbInfo.anonKey}',
    'Authorization': 'Bearer ${dbInfo.anonKey}',
    'Content-Type': 'application/json'
  }
})`
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Database Information</h1>
        <p className="text-gray-600">Connection details and API information for external applications</p>
      </div>

      {/* Connection Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <SafeIcon icon={FiDatabase} className="h-5 w-5 mr-2" />
            Connection Details
          </h3>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SafeIcon icon={showCredentials ? FiEyeOff : FiEye} className="h-4 w-4" />
            <span>{showCredentials ? 'Hide' : 'Show'} Credentials</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dbInfo.host}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(dbInfo.host, 'Host')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={copiedField === 'Host' ? FiDatabase : FiCopy} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dbInfo.port}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(dbInfo.port.toString(), 'Port')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={copiedField === 'Port' ? FiDatabase : FiCopy} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Database</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dbInfo.database}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(dbInfo.database, 'Database')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={copiedField === 'Database' ? FiDatabase : FiCopy} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supabase URL</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={dbInfo.supabaseUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(dbInfo.supabaseUrl, 'Supabase URL')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={copiedField === 'Supabase URL' ? FiDatabase : FiCopy} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showCredentials && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={dbInfo.username}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(dbInfo.username, 'Username')}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <SafeIcon icon={copiedField === 'Username' ? FiDatabase : FiCopy} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value={dbInfo.password}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(dbInfo.password, 'Password')}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <SafeIcon icon={copiedField === 'Password' ? FiDatabase : FiCopy} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* API Keys */}
      {showCredentials && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <SafeIcon icon={FiKey} className="h-5 w-5 mr-2" />
            API Keys
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anonymous Key (Public)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  value={dbInfo.anonKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(dbInfo.anonKey, 'Anon Key')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={copiedField === 'Anon Key' ? FiDatabase : FiCopy} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Role Key (Private)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  value={dbInfo.serviceKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(dbInfo.serviceKey, 'Service Key')}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <SafeIcon icon={copiedField === 'Service Key' ? FiDatabase : FiCopy} className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-red-600 mt-1">
                <SafeIcon icon={FiLock} className="h-3 w-3 inline mr-1" />
                Keep this key secret! Only use on server-side applications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Database Schemas */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SafeIcon icon={FiServer} className="h-5 w-5 mr-2" />
          Database Schemas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schemas.map((schema, index) => (
            <motion.div
              key={schema.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-3">
                <SafeIcon icon={FiDatabase} className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">{schema.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{schema.description}</p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tables:</p>
                {schema.tables.map((table) => (
                  <p key={table} className="text-xs text-gray-600 font-mono">• {table}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <SafeIcon icon={FiCode} className="h-5 w-5 mr-2" />
          Connection Examples
        </h3>
        
        <div className="space-y-6">
          {Object.entries(connectionExamples).map(([language, code]) => (
            <div key={language} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                <span className="font-medium text-gray-900 capitalize">{language}</span>
                <button
                  onClick={() => copyToClipboard(code, `${language} code`)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <SafeIcon icon={FiCopy} className="h-4 w-4" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiLock} className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900">Security Guidelines</h4>
            <ul className="mt-2 text-sm text-yellow-800 space-y-1">
              <li>• Never expose service role keys in client-side code</li>
              <li>• Use environment variables for sensitive credentials</li>
              <li>• Implement Row Level Security (RLS) policies</li>
              <li>• Regularly rotate API keys and passwords</li>
              <li>• Use HTTPS for all API communications</li>
              <li>• Validate and sanitize all user inputs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiBook} className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Documentation & Resources</h4>
            <div className="mt-2 space-y-1">
              <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-700 hover:text-blue-900">
                • Supabase Documentation
              </a>
              <a href="https://supabase.com/docs/guides/api" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-700 hover:text-blue-900">
                • REST API Reference
              </a>
              <a href="https://supabase.com/docs/guides/database/connecting-to-postgres" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-700 hover:text-blue-900">
                • Direct Database Connections
              </a>
              <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-700 hover:text-blue-900">
                • Row Level Security Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseInfo;