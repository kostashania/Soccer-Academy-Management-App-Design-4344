import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { 
  FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, 
  FiPackage, FiMessageSquare, FiAlertCircle, FiCheck
} = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTheme();

  const stats = [
    {
      name: 'Total Players',
      value: '142',
      change: '+12%',
      changeType: 'positive',
      icon: FiUsers,
    },
    {
      name: 'This Month Revenue',
      value: '€8,420',
      change: '+18%',
      changeType: 'positive',
      icon: FiDollarSign,
    },
    {
      name: 'Active Sessions',
      value: '24',
      change: '+5%',
      changeType: 'positive',
      icon: FiCalendar,
    },
    {
      name: 'Pending Payments',
      value: '€1,230',
      change: '-8%',
      changeType: 'negative',
      icon: FiAlertCircle,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      message: 'Payment received from John Smith',
      time: '2 hours ago',
      icon: FiCheck,
      iconColor: 'text-green-500',
    },
    {
      id: 2,
      type: 'training',
      message: 'New training session scheduled for K10 team',
      time: '4 hours ago',
      icon: FiCalendar,
      iconColor: 'text-blue-500',
    },
    {
      id: 3,
      type: 'message',
      message: 'New message from Sarah Coach',
      time: '6 hours ago',
      icon: FiMessageSquare,
      iconColor: 'text-purple-500',
    },
    {
      id: 4,
      type: 'inventory',
      message: 'Low stock alert: Soccer balls (5 remaining)',
      time: '8 hours ago',
      icon: FiPackage,
      iconColor: 'text-orange-500',
    },
  ];

  const quickActions = [
    { name: 'Schedule Training', icon: FiCalendar, href: '/calendar' },
    { name: 'Add Payment', icon: FiDollarSign, href: '/payments' },
    { name: 'Send Message', icon: FiMessageSquare, href: '/messages' },
    { name: 'Manage Inventory', icon: FiPackage, href: '/store' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          {t('welcome')} back, {user?.name}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening at your soccer academy today.
        </p>
      </motion.div>

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
              <div className="p-3 bg-primary-50 rounded-lg">
                <SafeIcon icon={stat.icon} className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('recentActivity')}
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <SafeIcon
                      icon={activity.icon}
                      className={`h-4 w-4 ${activity.iconColor}`}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('quickActions')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                className="flex flex-col items-center p-4 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group"
              >
                <SafeIcon
                  icon={action.icon}
                  className="h-6 w-6 text-gray-600 group-hover:text-primary-600 mb-2"
                />
                <span className="text-sm font-medium text-gray-900 text-center">
                  {action.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;