import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUsers, FiDollarSign, FiBarChart2, FiCalendar, FiTrendingUp, FiAlertCircle 
} from 'react-icons/fi'
import { useSupabaseData } from '../../hooks/useSupabaseData'

const AdminDashboard = () => {
  const { data: players } = useSupabaseData('players')
  const { data: payments } = useSupabaseData('payments')
  const { data: invoices } = useSupabaseData('invoices')
  const { data: teams } = useSupabaseData('teams')

  const stats = [
    {
      name: 'Active Players',
      value: players.filter(p => p.is_active).length,
      icon: FiUsers,
      color: 'blue',
      change: '+5%'
    },
    {
      name: 'Monthly Revenue',
      value: `€${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'green',
      change: '+12%'
    },
    {
      name: 'Outstanding',
      value: `€${invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + (i.amount || 0), 0).toLocaleString()}`,
      icon: FiAlertCircle,
      color: 'orange',
      change: '-3%'
    },
    {
      name: 'Teams',
      value: teams.length,
      icon: FiUsers,
      color: 'purple',
      change: '+2%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">Manage your sports academy efficiently</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiUsers className="h-5 w-5 text-blue-600 mr-3" />
            <span className="font-medium">Add New Player</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiDollarSign className="h-5 w-5 text-green-600 mr-3" />
            <span className="font-medium">Generate Invoices</span>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiCalendar className="h-5 w-5 text-purple-600 mr-3" />
            <span className="font-medium">Schedule Training</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Payment #{payment.id}</p>
                  <p className="text-sm text-gray-600">{new Date(payment.created_at).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-green-600">€{payment.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Invoices</h3>
          <div className="space-y-3">
            {invoices.filter(i => i.status === 'pending').slice(0, 5).map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Invoice #{invoice.id}</p>
                  <p className="text-sm text-gray-600">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-orange-600">€{invoice.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard