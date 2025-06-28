import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUsers, FiDollarSign, FiBarChart2, FiSettings, FiShield, 
  FiDatabase, FiActivity, FiTrendingUp, FiAlertTriangle 
} from 'react-icons/fi'
import { useSupabaseData } from '../../hooks/useSupabaseData'

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch system-wide data
  const { data: users } = useSupabaseData('profiles')
  const { data: payments } = useSupabaseData('payments')
  const { data: invoices } = useSupabaseData('invoices')

  const systemStats = {
    totalUsers: users.length,
    totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    pendingInvoices: invoices.filter(i => i.status === 'pending').length,
    overdueInvoices: invoices.filter(i => i.status === 'overdue').length
  }

  const stats = [
    {
      name: 'Total Users',
      value: systemStats.totalUsers,
      icon: FiUsers,
      color: 'blue',
      change: '+12%'
    },
    {
      name: 'Total Revenue',
      value: `€${systemStats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'green',
      change: '+8%'
    },
    {
      name: 'Pending Invoices',
      value: systemStats.pendingInvoices,
      icon: FiBarChart2,
      color: 'yellow',
      change: '-5%'
    },
    {
      name: 'System Health',
      value: '99.9%',
      icon: FiActivity,
      color: 'green',
      change: '+0.1%'
    }
  ]

  const recentActivity = [
    { action: 'New user registration', user: 'John Parent', time: '5 min ago' },
    { action: 'Payment processed', user: 'Sarah Coach', time: '12 min ago' },
    { action: 'Invoice generated', user: 'System', time: '1 hour ago' },
    { action: 'Team created', user: 'Mike Admin', time: '2 hours ago' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <FiShield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Super Admin Dashboard</h1>
            <p className="text-purple-100">Complete system control and management</p>
          </div>
        </div>
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
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'overview', name: 'Overview', icon: FiBarChart2 },
            { id: 'users', name: 'User Management', icon: FiUsers },
            { id: 'financial', name: 'Financial Control', icon: FiDollarSign },
            { id: 'system', name: 'System Config', icon: FiSettings },
            { id: 'security', name: 'Security', icon: FiShield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Database Health</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 font-medium">Excellent</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-medium">247 users</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-medium">2.3 GB / 10 GB</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">API Calls Today</span>
                  <span className="font-medium">12,847</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-sm font-medium text-gray-900">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Controls</h3>
              <p className="text-gray-600">Advanced financial management and controls will be implemented here.</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
              <p className="text-gray-600">System-wide configuration options will be available here.</p>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Management</h3>
              <p className="text-gray-600">Security settings and audit logs will be managed here.</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default SuperAdminDashboard