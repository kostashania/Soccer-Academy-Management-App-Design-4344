import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import AddPaymentModal from '../../components/modals/AddPaymentModal';
import { toast } from 'react-toastify';

const { 
  FiCreditCard, FiDollarSign, FiTrendingUp, FiAlertCircle, FiCheck, 
  FiClock, FiDownload, FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2 
} = FiIcons;

const Payments = () => {
  const { t } = useTheme();
  const { payments, deletePayment, updatePayment } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const paymentStats = [
    {
      name: 'Total Revenue',
      value: `€${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      icon: FiDollarSign,
    },
    {
      name: 'Paid This Month',
      value: `€${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      change: '+18%',
      changeType: 'positive',
      icon: FiCheck,
    },
    {
      name: 'Outstanding Balance',
      value: `€${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      change: '-8%',
      changeType: 'negative',
      icon: FiAlertCircle,
    },
    {
      name: 'Pending Payments',
      value: payments.filter(p => p.status === 'pending').length.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: FiClock,
    },
  ];

  const upcomingPayments = [
    {
      id: '1',
      studentName: 'Jake Thompson',
      amount: 120.00,
      dueDate: '2024-03-20',
      description: 'Monthly subscription - March'
    },
    {
      id: '2',
      studentName: 'Sophie Brown',
      amount: 95.00,
      dueDate: '2024-03-22',
      description: 'Equipment + Monthly fee'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return FiCheck;
      case 'pending': return FiClock;
      case 'overdue': return FiAlertCircle;
      default: return FiClock;
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowAddModal(true);
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deletePayment(paymentId);
      toast.success('Payment deleted successfully!');
    }
  };

  const handleMarkAsPaid = (paymentId) => {
    updatePayment(paymentId, { status: 'paid', date: new Date().toISOString().split('T')[0] });
    toast.success('Payment marked as paid!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('payments')}</h1>
          <p className="text-gray-600 mt-1">Manage payments and subscriptions</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => {
              setEditingPayment(null);
              setShowAddModal(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
            Add Payment
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paymentStats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <SafeIcon icon={stat.icon} className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'recent', name: 'Recent Payments' },
            { id: 'upcoming', name: 'Upcoming' },
            { id: 'reports', name: 'Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <SafeIcon icon={FiCreditCard} className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <span className="text-sm text-gray-600">78%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <SafeIcon icon={FiDollarSign} className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <span className="text-sm text-gray-600">22%</span>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Revenue chart would go here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="bg-white rounded-xl shadow-soft border border-gray-100">
            {/* Search and Filter */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <SafeIcon icon={FiFilter} className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Parent</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">{payment.studentName}</td>
                      <td className="py-4 px-6 text-gray-600">{payment.parentName}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">€{payment.amount.toFixed(2)}</td>
                      <td className="py-4 px-6 text-gray-600">{payment.date}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          <SafeIcon icon={getStatusIcon(payment.status)} className="h-3 w-3 mr-1" />
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleMarkAsPaid(payment.id)}
                              className="text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleEditPayment(payment)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                          </button>
                          <button className="text-primary-600 hover:text-primary-700">
                            <SafeIcon icon={FiDownload} className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Payments</h3>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{payment.studentName}</h4>
                    <p className="text-sm text-gray-600">{payment.description}</p>
                    <p className="text-sm text-yellow-700 font-medium">Due: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">€{payment.amount.toFixed(2)}</p>
                    <button className="mt-2 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
                      Send Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Month</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Monthly revenue chart</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Paid on Time</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">83%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Late Payments</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-4 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-1 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Payment Modal */}
      <AddPaymentModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingPayment(null);
        }}
        payment={editingPayment}
      />
    </div>
  );
};

export default Payments;