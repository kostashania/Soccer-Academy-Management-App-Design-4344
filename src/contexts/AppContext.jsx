import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
  const { user, profile, isAuthenticated } = useAuth();
  
  // State
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      loadInitialData();
    }
  }, [isAuthenticated, profile]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPlayers(),
        loadTeams(),
        loadInvoices(),
        loadPayments(),
        loadSeasons(),
        loadTrainingSessions(),
        loadAttendance()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Data loading functions
  const loadPlayers = async () => {
    try {
      let query = supabase
        .from('players')
        .select(`
          *,
          profile:profiles!players_user_id_fkey(first_name, last_name, phone),
          parent:profiles!players_parent_id_fkey(first_name, last_name, phone),
          team:teams(name)
        `);

      // Role-based filtering
      if (profile?.role === 'parent') {
        query = query.eq('parent_id', user.id);
      } else if (profile?.role === 'trainer') {
        query = query.in('team_id', await getTrainerTeamIds());
      }

      const { data, error } = await query;
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const loadTeams = async () => {
    try {
      let query = supabase
        .from('teams')
        .select(`
          *,
          trainer:profiles!teams_trainer_id_fkey(first_name, last_name),
          season:seasons(name, start_date, end_date)
        `);

      if (profile?.role === 'trainer') {
        query = query.eq('trainer_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadInvoices = async () => {
    try {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          player:players!inner(
            id,
            profile:profiles!players_user_id_fkey(first_name, last_name),
            parent:profiles!players_parent_id_fkey(first_name, last_name)
          ),
          custom_fee_adjustments(*)
        `)
        .order('created_at', { ascending: false });

      // Role-based filtering
      if (profile?.role === 'parent') {
        query = query.eq('player.parent_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          invoice:invoices(
            *,
            player:players(
              profile:profiles!players_user_id_fkey(first_name, last_name)
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const loadSeasons = async () => {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setSeasons(data || []);
    } catch (error) {
      console.error('Error loading seasons:', error);
    }
  };

  const loadTrainingSessions = async () => {
    try {
      let query = supabase
        .from('training_sessions')
        .select(`
          *,
          team:teams(name)
        `)
        .order('start_time', { ascending: true });

      if (profile?.role === 'trainer') {
        const teamIds = await getTrainerTeamIds();
        query = query.in('team_id', teamIds);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTrainingSessions(data || []);
    } catch (error) {
      console.error('Error loading training sessions:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          player:players(
            profile:profiles!players_user_id_fkey(first_name, last_name)
          )
        `)
        .order('training_date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  // Helper functions
  const getTrainerTeamIds = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('id')
      .eq('trainer_id', user.id);

    if (error) return [];
    return data.map(team => team.id);
  };

  // CRUD Operations
  const createPlayer = async (playerData) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert(playerData)
        .select()
        .single();

      if (error) throw error;
      
      await loadPlayers();
      toast.success('Player created successfully');
      return { success: true, data };
    } catch (error) {
      toast.error('Error creating player');
      return { success: false, error: error.message };
    }
  };

  const updatePlayer = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await loadPlayers();
      toast.success('Player updated successfully');
      return { success: true, data };
    } catch (error) {
      toast.error('Error updating player');
      return { success: false, error: error.message };
    }
  };

  const createInvoice = async (invoiceData) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (error) throw error;
      
      await loadInvoices();
      toast.success('Invoice created successfully');
      return { success: true, data };
    } catch (error) {
      toast.error('Error creating invoice');
      return { success: false, error: error.message };
    }
  };

  const adjustInvoiceAmount = async (invoiceId, newAmount, reason) => {
    try {
      // Create adjustment record
      const { error: adjustmentError } = await supabase
        .from('custom_fee_adjustments')
        .insert({
          invoice_id: invoiceId,
          admin_id: user.id,
          new_amount: newAmount,
          reason: reason
        });

      if (adjustmentError) throw adjustmentError;

      // Update invoice amount
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ amount: newAmount })
        .eq('id', invoiceId);

      if (updateError) throw updateError;

      await loadInvoices();
      toast.success('Invoice amount adjusted successfully');
      return { success: true };
    } catch (error) {
      toast.error('Error adjusting invoice amount');
      return { success: false, error: error.message };
    }
  };

  const recordPayment = async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (error) throw error;

      // Update invoice status if fully paid
      const invoice = invoices.find(inv => inv.id === paymentData.invoice_id);
      if (invoice && paymentData.amount_paid >= invoice.amount) {
        await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', paymentData.invoice_id);
      }

      await Promise.all([loadPayments(), loadInvoices()]);
      toast.success('Payment recorded successfully');
      return { success: true, data };
    } catch (error) {
      toast.error('Error recording payment');
      return { success: false, error: error.message };
    }
  };

  const markAttendance = async (playerId, trainingDate, status) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert({
          player_id: playerId,
          training_date: trainingDate,
          status: status
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadAttendance();
      toast.success('Attendance marked successfully');
      return { success: true, data };
    } catch (error) {
      toast.error('Error marking attendance');
      return { success: false, error: error.message };
    }
  };

  // Generate monthly invoices (Admin only)
  const generateMonthlyInvoices = async () => {
    if (profile?.role !== 'admin') {
      toast.error('Unauthorized action');
      return;
    }

    try {
      setLoading(true);
      
      // Get all active players
      const { data: activePlayers, error } = await supabase
        .from('players')
        .select('id, monthly_fee')
        .eq('is_active', true);

      if (error) throw error;

      // Create invoices for next month
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const invoiceData = activePlayers.map(player => ({
        player_id: player.id,
        due_date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15).toISOString().split('T')[0],
        amount: player.monthly_fee || 50.00,
        status: 'pending'
      }));

      const { error: insertError } = await supabase
        .from('invoices')
        .insert(invoiceData);

      if (insertError) throw insertError;

      await loadInvoices();
      toast.success(`Generated ${invoiceData.length} invoices for next month`);
    } catch (error) {
      toast.error('Error generating monthly invoices');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analytics and Reports
  const getFinancialSummary = () => {
    const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount_paid || 0), 0);
    const outstandingAmount = invoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + parseFloat(invoice.amount || 0), 0);
    
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
    const overdueInvoices = invoices.filter(invoice => invoice.status === 'overdue').length;

    return {
      totalRevenue,
      outstandingAmount,
      paidInvoices,
      overdueInvoices,
      totalInvoices: invoices.length
    };
  };

  const getAttendanceStats = () => {
    const totalSessions = attendance.length;
    const presentSessions = attendance.filter(att => att.status === 'present').length;
    const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;

    return {
      totalSessions,
      presentSessions,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    };
  };

  const value = {
    // Data
    players,
    teams,
    invoices,
    payments,
    seasons,
    trainingSessions,
    attendance,
    loading,

    // CRUD Operations
    createPlayer,
    updatePlayer,
    createInvoice,
    adjustInvoiceAmount,
    recordPayment,
    markAttendance,

    // Admin Functions
    generateMonthlyInvoices,

    // Analytics
    getFinancialSummary,
    getAttendanceStats,

    // Refresh Data
    loadInitialData,
    loadPlayers,
    loadInvoices,
    loadPayments
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};