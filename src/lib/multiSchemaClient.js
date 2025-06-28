import { createClient } from '@supabase/supabase-js';

// Multi-schema Supabase client configuration
class MultiSchemaSupabaseClient {
  constructor() {
    this.clients = new Map();
    this.defaultClient = null;
    this.connections = new Map();
  }

  // Initialize default client
  initializeDefault(url, anonKey, options = {}) {
    this.defaultClient = createClient(url, anonKey, {
      ...options,
      db: {
        schema: 'academies' // Default schema
      }
    });
    return this.defaultClient;
  }

  // Add a new connection configuration
  addConnection(name, config) {
    this.connections.set(name, config);
    
    // Create client for this connection
    if (config.supabase_url && config.supabase_anon_key) {
      const client = createClient(config.supabase_url, config.supabase_anon_key, {
        db: {
          schema: config.app_schema || 'public'
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      
      this.clients.set(name, client);
    }
  }

  // Get client for specific connection
  getClient(connectionName = 'default') {
    if (connectionName === 'default') {
      return this.defaultClient;
    }
    
    return this.clients.get(connectionName);
  }

  // Get client for specific schema
  getSchemaClient(schema) {
    // Find connection that matches schema
    for (const [name, config] of this.connections) {
      if (config.app_schema === schema) {
        return this.clients.get(name);
      }
    }
    
    // Fallback to default client with schema override
    if (this.defaultClient) {
      return createClient(
        this.defaultClient.supabaseUrl,
        this.defaultClient.supabaseKey,
        {
          db: { schema }
        }
      );
    }
    
    return null;
  }

  // Cross-schema query helper
  async crossSchemaQuery(queries) {
    const results = {};
    
    for (const [schema, query] of Object.entries(queries)) {
      const client = this.getSchemaClient(schema);
      if (client) {
        try {
          results[schema] = await query(client);
        } catch (error) {
          console.error(`Error in ${schema} schema query:`, error);
          results[schema] = { error };
        }
      }
    }
    
    return results;
  }

  // Test connection
  async testConnection(connectionName) {
    const client = this.getClient(connectionName);
    if (!client) {
      throw new Error(`Connection ${connectionName} not found`);
    }

    try {
      // Try a simple query to test the connection
      const { data, error } = await client
        .from('user_profiles_sa2025')
        .select('id')
        .limit(1);
      
      if (error && !error.message.includes('permission')) {
        throw error;
      }
      
      return { success: true, connection: connectionName };
    } catch (error) {
      throw new Error(`Connection test failed: ${error.message}`);
    }
  }

  // Get all active connections
  getActiveConnections() {
    return Array.from(this.connections.entries()).map(([name, config]) => ({
      name,
      ...config,
      hasClient: this.clients.has(name)
    }));
  }

  // Academy-specific queries
  academies() {
    const client = this.getSchemaClient('academies');
    return {
      users: () => client.from('user_profiles_sa2025'),
      teams: () => client.from('teams_sa2025'),
      players: () => client.from('player_profiles_sa2025'),
      coaches: () => client.from('coach_profiles_sa2025'),
      parents: () => client.from('parent_profiles_sa2025'),
      events: () => client.from('events_sa2025'),
      products: () => client.from('products_sa2025'),
      categories: () => client.from('product_categories_sa2025'),
      locations: () => client.from('locations_sa2025')
    };
  }

  // Financial-specific queries
  financial() {
    const client = this.getSchemaClient('financial');
    return {
      payments: () => client.from('payments_sa2025'),
      invoices: () => client.from('invoices_sa2025'),
      transactions: () => client.from('transactions_sa2025'),
      feeStructures: () => client.from('fee_structures_sa2025')
    };
  }

  // Shared-specific queries
  shared() {
    const client = this.getSchemaClient('shared');
    return {
      connections: () => client.from('database_connections'),
      settings: () => client.from('system_settings'),
      auditLog: () => client.from('cross_app_audit_log')
    };
  }
}

// Create and export singleton instance
export const multiSchemaClient = new MultiSchemaSupabaseClient();

// Initialize with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  multiSchemaClient.initializeDefault(supabaseUrl, supabaseAnonKey);
}

// Export individual schema clients for convenience
export const academiesClient = () => multiSchemaClient.academies();
export const financialClient = () => multiSchemaClient.financial();
export const sharedClient = () => multiSchemaClient.shared();

export default multiSchemaClient;