import { multiSchemaClient } from '../lib/multiSchemaClient';
import { toast } from 'react-toastify';

// Cross-app data synchronization service
export class CrossAppService {
  constructor() {
    this.syncQueue = [];
    this.isProcessing = false;
  }

  // Add sync operation to queue
  queueSync(operation) {
    this.syncQueue.push({
      id: Date.now(),
      timestamp: new Date(),
      ...operation
    });
    
    if (!this.isProcessing) {
      this.processSyncQueue();
    }
  }

  // Process sync queue
  async processSyncQueue() {
    this.isProcessing = true;
    
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      
      try {
        await this.executeSyncOperation(operation);
      } catch (error) {
        console.error('Sync operation failed:', error);
        // Optionally re-queue failed operations
      }
    }
    
    this.isProcessing = false;
  }

  // Execute individual sync operation
  async executeSyncOperation(operation) {
    const { type, sourceSchema, targetSchema, data, action } = operation;
    
    switch (type) {
      case 'user_sync':
        return await this.syncUser(data, sourceSchema, targetSchema);
      case 'financial_sync':
        return await this.syncFinancialData(data, action);
      case 'audit_log':
        return await this.logCrossAppAction(data);
      default:
        throw new Error(`Unknown sync operation type: ${type}`);
    }
  }

  // Sync user data between schemas
  async syncUser(userData, sourceSchema = 'academies', targetSchemas = ['financial']) {
    try {
      const results = await multiSchemaClient.crossSchemaQuery({
        [sourceSchema]: async (client) => {
          return await client
            .from('user_profiles_sa2025')
            .select('*')
            .eq('id', userData.id)
            .single();
        }
      });

      const sourceUser = results[sourceSchema]?.data;
      if (!sourceUser) {
        throw new Error('Source user not found');
      }

      // Sync to target schemas
      for (const targetSchema of targetSchemas) {
        if (targetSchema === 'financial') {
          await this.syncUserToFinancial(sourceUser);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('User sync failed:', error);
      throw error;
    }
  }

  // Sync user to financial schema
  async syncUserToFinancial(user) {
    const client = multiSchemaClient.getSchemaClient('financial');
    if (!client) return;

    // Check if user reference already exists in financial schema
    const { data: existingRef } = await client
      .rpc('check_user_reference', { user_id: user.id });

    if (!existingRef) {
      // Create reference in financial schema if needed
      await client
        .from('user_references')
        .upsert({
          academy_user_id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          last_synced: new Date().toISOString()
        });
    }
  }

  // Sync financial data
  async syncFinancialData(data, action = 'create') {
    try {
      const financialClient = multiSchemaClient.financial();
      
      switch (action) {
        case 'create':
          return await financialClient.payments().insert(data);
        case 'update':
          return await financialClient.payments()
            .update(data)
            .eq('id', data.id);
        case 'delete':
          return await financialClient.payments()
            .delete()
            .eq('id', data.id);
        default:
          throw new Error(`Unknown financial action: ${action}`);
      }
    } catch (error) {
      console.error('Financial sync failed:', error);
      throw error;
    }
  }

  // Log cross-app actions
  async logCrossAppAction(actionData) {
    try {
      const sharedClient = multiSchemaClient.shared();
      
      return await sharedClient.auditLog().insert({
        app_schema: actionData.schema,
        table_name: actionData.table,
        record_id: actionData.recordId,
        action: actionData.action,
        old_values: actionData.oldValues,
        new_values: actionData.newValues,
        user_id: actionData.userId,
        user_role: actionData.userRole,
        ip_address: actionData.ipAddress,
        user_agent: actionData.userAgent
      });
    } catch (error) {
      console.error('Audit log failed:', error);
      // Don't throw here as audit logging shouldn't break main operations
    }
  }

  // Get financial summary for academy
  async getFinancialSummary(academyId) {
    try {
      const results = await multiSchemaClient.crossSchemaQuery({
        academies: async (client) => {
          return await client
            .from('user_profiles_sa2025')
            .select('id, full_name, role')
            .eq('academy_id', academyId);
        },
        financial: async (client) => {
          return await client
            .from('payments_sa2025')
            .select('amount, status, payment_type, created_at')
            .eq('academy_id', academyId);
        }
      });

      const users = results.academies?.data || [];
      const payments = results.financial?.data || [];

      return {
        totalUsers: users.length,
        totalRevenue: payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + parseFloat(p.amount), 0),
        pendingPayments: payments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + parseFloat(p.amount), 0),
        recentPayments: payments
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Failed to get financial summary:', error);
      throw error;
    }
  }

  // Create payment from academy data
  async createPaymentFromAcademy(playerData, paymentData) {
    try {
      // Get player and parent info from academies schema
      const academyData = await multiSchemaClient.crossSchemaQuery({
        academies: async (client) => {
          const { data: player } = await client
            .from('player_profiles_sa2025')
            .select(`
              *,
              user_profile:user_profiles_sa2025(*),
              parent_links:player_parent_links_sa2025(
                *,
                parent:parent_profiles_sa2025(
                  *,
                  user_profile:user_profiles_sa2025(*)
                )
              )
            `)
            .eq('id', playerData.id)
            .single();
          
          return player;
        }
      });

      const player = academyData.academies;
      if (!player) {
        throw new Error('Player not found');
      }

      const primaryParent = player.parent_links?.find(link => link.is_primary)?.parent;
      if (!primaryParent) {
        throw new Error('Primary parent not found');
      }

      // Create payment in financial schema
      const financialClient = multiSchemaClient.financial();
      const { data: payment, error } = await financialClient.payments().insert({
        academy_id: player.academy_id,
        player_id: player.id,
        parent_id: primaryParent.id,
        ...paymentData
      });

      if (error) throw error;

      // Log the cross-app action
      await this.logCrossAppAction({
        schema: 'financial',
        table: 'payments_sa2025',
        recordId: payment.id,
        action: 'INSERT',
        newValues: payment,
        userId: paymentData.created_by,
        userRole: 'admin'
      });

      return payment;
    } catch (error) {
      console.error('Failed to create payment from academy:', error);
      throw error;
    }
  }

  // Get cross-app analytics
  async getCrossAppAnalytics(dateRange = '30d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(dateRange));

      const results = await multiSchemaClient.crossSchemaQuery({
        academies: async (client) => {
          const { data: newUsers } = await client
            .from('user_profiles_sa2025')
            .select('created_at, role')
            .gte('created_at', startDate.toISOString());
          
          const { data: events } = await client
            .from('events_sa2025')
            .select('created_at, event_type')
            .gte('created_at', startDate.toISOString());

          return { newUsers, events };
        },
        financial: async (client) => {
          const { data: payments } = await client
            .from('payments_sa2025')
            .select('amount, status, payment_type, created_at')
            .gte('created_at', startDate.toISOString());

          const { data: invoices } = await client
            .from('invoices_sa2025')
            .select('total_amount, status, created_at')
            .gte('created_at', startDate.toISOString());

          return { payments, invoices };
        }
      });

      return {
        academies: results.academies?.data || {},
        financial: results.financial?.data || {},
        period: { startDate, endDate }
      };
    } catch (error) {
      console.error('Failed to get cross-app analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const crossAppService = new CrossAppService();

// Utility functions for common cross-app operations
export const crossAppUtils = {
  // Create payment for player
  async createPlayerPayment(playerId, paymentData) {
    return await crossAppService.createPaymentFromAcademy(
      { id: playerId },
      paymentData
    );
  },

  // Get player financial summary
  async getPlayerFinancials(playerId) {
    const financialClient = multiSchemaClient.financial();
    return await financialClient.payments()
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });
  },

  // Sync user across all schemas
  async syncUserEverywhere(userId) {
    return await crossAppService.syncUser(
      { id: userId },
      'academies',
      ['financial']
    );
  }
};

export default crossAppService;