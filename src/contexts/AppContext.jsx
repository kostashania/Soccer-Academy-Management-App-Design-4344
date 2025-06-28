import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Mock data for development
  useEffect(() => {
    if (isAuthenticated && profile) {
      loadMockData();
    }
  }, [isAuthenticated, profile]);

  const loadMockData = () => {
    setLoading(true);
    
    // Mock players
    setPlayers([
      {
        id: '1',
        profile: { first_name: 'John', last_name: 'Doe' },
        parent_id: 'parent1',
        team_id: 'team1',
        is_active: true
      },
      {
        id: '2',
        profile: { first_name: 'Jane', last_name: 'Smith' },
        parent_id: 'parent2',
        team_id: 'team1',
        is_active: true
      }
    ]);

    // Mock teams
    setTeams([
      {
        id: 'team1',
        name: 'U12 Lions',
        trainer_id: 'trainer1'
      }
    ]);

    // Mock invoices
    setInvoices([
      {
        id: 'inv1',
        player_id: '1',
        amount: 120,
        due_date: '2024-02-15',
        status: 'pending',
        created_at: '2024-01-15'
      }
    ]);

    // Mock payments
    setPayments([
      {
        id: 'pay1',
        invoice_id: 'inv1',
        amount_paid: 120,
        status: 'paid',
        created_at: '2024-01-20'
      }
    ]);

    // Mock attendance
    setAttendance([
      {
        id: 'att1',
        player_id: '1',
        training_date: '2024-01-15',
        status: 'present'
      }
    ]);

    setLoading(false);
  };

  // Helper functions
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

  // CRUD Operations (mock implementations)
  const generateMonthlyInvoices = async () => {
    setLoading(true);
    try {
      // Mock invoice generation
      toast.success('Monthly invoices generated successfully!');
    } catch (error) {
      toast.error('Error generating invoices');
    } finally {
      setLoading(false);
    }
  };

  const adjustInvoiceAmount = async (invoiceId, newAmount, reason) => {
    try {
      // Mock adjustment
      setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, amount: newAmount }
          : inv
      ));
      toast.success('Invoice adjusted successfully');
      return { success: true };
    } catch (error) {
      toast.error('Error adjusting invoice');
      return { success: false, error: error.message };
    }
  };

  const recordPayment = async (paymentData) => {
    try {
      // Mock payment recording
      const newPayment = {
        id: Date.now().toString(),
        ...paymentData,
        created_at: new Date().toISOString()
      };
      setPayments(prev => [...prev, newPayment]);
      toast.success('Payment recorded successfully');
      return { success: true };
    } catch (error) {
      toast.error('Error recording payment');
      return { success: false, error: error.message };
    }
  };

  const markAttendance = async (playerId, trainingDate, status) => {
    try {
      // Mock attendance marking
      const newAttendance = {
        id: Date.now().toString(),
        player_id: playerId,
        training_date: trainingDate,
        status: status
      };
      setAttendance(prev => {
        const filtered = prev.filter(att => 
          !(att.player_id === playerId && att.training_date === trainingDate)
        );
        return [...filtered, newAttendance];
      });
      toast.success('Attendance marked successfully');
      return { success: true };
    } catch (error) {
      toast.error('Error marking attendance');
      return { success: false, error: error.message };
    }
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

    // Functions
    getFinancialSummary,
    getAttendanceStats,
    generateMonthlyInvoices,
    adjustInvoiceAmount,
    recordPayment,
    markAttendance
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};