import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../contexts/AppContext';

const { FiDollarSign, FiTrendingUp, FiDownload, FiFilter, FiCalendar, FiPieChart, FiBarChart3 } = FiIcons;

const FinanceModule = () => {
  const { payments, products } = useApp();
  const [dateRange, setDateRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Calculate financial metrics
  const totalSubscriptionIncome = payments
    .filter(p => p.status === 'paid' && p.paymentType === 'subscription')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalItemSales = payments
    .filter(p => p.status === 'paid' && p.paymentType === 'store_item')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalManualPayments = payments
    .filter(p => p.status === 'paid' && p.paymentType === 'manual')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const outstandingBalance = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRevenue = totalSubscriptionIncome + totalItemSales + totalManualPayments;

  // Monthly data for charts
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date().getMonth() - i;
    const monthPayments = payments.filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getMonth() === month && p.status === 'paid';
    });
    
    return {
      month: new Date(2024, month).toLocaleDateString('en', { month: 'short' }),
      subscription: monthPayments.filter(p => p.paymentType === 'subscription').reduce((sum, p) => sum + p.amount, 0),
      store: monthPayments.filter(p => p.paymentType === 'store_item').reduce((sum, p) => sum + p.amount, 0),
      manual: monthPayments.filter(p => p.paymentType === 'manual').reduce((sum, p) => sum + p.amount, 0)
    };
  }).reverse();

  const stats = [
    {
      name: 'Total Revenue',
      value: `€${totalRevenue.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      icon: FiDollarSign,
      color: 'blue'
    },
    {
      name: 'Subscription Income',
      value: `€${totalSubscriptionIncome.toLocaleString()}`,
      change: '+8%',
      changeType: 'positive',
      icon: FiTrendingUp,
      color: 'green'
    },
    {
      name: 'Item Sales',
      value: `€${totalItemSales.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive',
      icon: FiPieChart,
      color: 'purple'
    },
    {
      name: 'Outstanding Balance',
      value: `€${outstandingBalance.toLocaleString()}`,
      change: '-5%',
      changeType: 'negative',
      icon: FiBarChart3,
      color: 'red'
    }
  ];

  const exportReport = () => {
    const csvContent = [
      ['Date', 'Student', 'Parent', 'Amount', 'Type', 'Status'],
      ...payments.map(p => [
        p.date,
        p.studentName,
        p.parentName,
        p.amount,
        p.paymentType || 'subscription',
        p.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Finance Dashboard</h2>
          <p className="text-gray-600 mt-1">Financial overview and reports</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <SafeIcon icon={stat.icon} className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Revenue chart visualization</p>
              <p className="text-sm text-gray-400 mt-1">Chart integration available</p>
            </div>
          </div>
        </div>

        {/* Payment Distribution */}
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm font-medium">Subscriptions</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">€{totalSubscriptionIncome.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((totalSubscriptionIncome / totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm font-medium">Store Sales</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">€{totalItemSales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((totalItemSales / totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span className="text-sm font-medium">Manual Payments</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">€{totalManualPayments.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((totalManualPayments / totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="subscription">Subscriptions</option>
              <option value="store_item">Store Sales</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter(p => categoryFilter === 'all' || p.paymentType === categoryFilter)
                .slice(0, 10)
                .map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-600">{payment.date}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{payment.studentName}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.paymentType === 'subscription' ? 'bg-blue-100 text-blue-800' :
                      payment.paymentType === 'store_item' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {payment.paymentType || 'subscription'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">€{payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;