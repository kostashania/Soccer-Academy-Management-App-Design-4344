import React, { useState } from 'react';
import { FiUsers, FiDollarSign, FiBarChart3, FiSettings, FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const SuperAdminDashboard = () => {
  const { profile } = useAuth();
  const { 
    players, 
    invoices, 
    payments, 
    teams,
    getFinancialSummary,
    generateMonthlyInvoices,
    adjustInvoiceAmount,
    recordPayment,
    loading
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Only allow admin access
  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  const financialSummary = getFinancialSummary();

  const handleAdjustInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setAdjustmentAmount(invoice.amount.toString());
    setAdjustmentReason('');
    setShowAdjustModal(true);
  };

  const submitAdjustment = async () => {
    if (!selectedInvoice || !adjustmentAmount || !adjustmentReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await adjustInvoiceAmount(
      selectedInvoice.id,
      parseFloat(adjustmentAmount),
      adjustmentReason
    );

    if (result.success) {
      setShowAdjustModal(false);
      setSelectedInvoice(null);
      setAdjustmentAmount('');
      setAdjustmentReason('');
    }
  };

  const handleGenerateInvoices = async () => {
    if (window.confirm('Generate monthly invoices for all active players?')) {
      await generateMonthlyInvoices();
    }
  };

  const markInvoiceAsPaid = async (invoiceId, amount) => {
    const paymentData = {
      invoice_id: invoiceId,
      amount_paid: amount,
      payment_method: 'admin_override',
      notes: 'Marked as paid by admin'
    };

    await recordPayment(paymentData);
  };

  const stats = [
    {
      name: 'Active Players',
      value: players.filter(p => p.is_active).length,
      icon: FiUsers,
      color: 'blue'
    },
    {
      name: 'Total Revenue',
      value: `$${financialSummary.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'green'
    },
    {
      name: 'Outstanding',
      value: `$${financialSummary.outstandingAmount.toFixed(2)}`,
      icon: FiBarChart3,
      color: 'orange'
    },
    {
      name: 'Overdue Invoices',
      value: financialSummary.overdueInvoices,
      icon: FiSettings,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Super Admin Dashboard</h1>
        <p className="text-purple-100">Complete system control and financial management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGenerateInvoices}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Generate Monthly Invoices
          </button>
          
          <button
            onClick={() => window.location.href = '/players'}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FiUsers className="h-4 w-4 mr-2" />
            Manage Players
          </button>
          
          <button
            onClick={() => window.location.href = '/reports'}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FiBarChart3 className="h-4 w-4 mr-2" />
            View Reports
          </button>
        </div>
      </div>

      {/* Recent Invoices with Admin Controls */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Player</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Due Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 10).map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {invoice.player?.profile?.first_name} {invoice.player?.profile?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Parent: {invoice.player?.parent?.first_name} {invoice.player?.parent?.last_name}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold">${invoice.amount}</td>
                  <td className="py-4 px-6">{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : invoice.status === 'waived'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAdjustInvoice(invoice)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Adjust Amount"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => markInvoiceAsPaid(invoice.id, invoice.amount)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Mark as Paid"
                        >
                          <FiDollarSign className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowAdjustModal(false)}
            />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Adjust Invoice Amount
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Adjustment
                  </label>
                  <select
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select reason...</option>
                    <option value="financial_hardship">Financial Hardship</option>
                    <option value="family_discount">Family Discount</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="admin_adjustment">Admin Adjustment</option>
                    <option value="proration">Proration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAdjustment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;