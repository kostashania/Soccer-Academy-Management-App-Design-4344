import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { 
  FiUser, FiCalendar, FiCreditCard, FiTrendingUp, 
  FiClock, FiMapPin, FiCheck, FiAlertCircle 
} = FiIcons;

const ParentDashboard = () => {
  const { user } = useAuth();

  const children = [
    {
      name: 'Emma Johnson',
      age: 8,
      team: 'K6 Lions',
      nextTraining: 'Today 4:00 PM',
      attendance: '95%',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Jake Johnson',
      age: 12,
      team: 'K10 Eagles',
      nextTraining: 'Tomorrow 3:00 PM',
      attendance: '88%',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    },
  ];

  const upcomingEvents = [
    {
      child: 'Emma Johnson',
      event: 'Training Session',
      date: 'Today',
      time: '4:00 PM',
      location: 'Field A',
      type: 'training'
    },
    {
      child: 'Jake Johnson',
      event: 'Match vs Blue Stars',
      date: 'Saturday',
      time: '10:00 AM',
      location: 'Main Stadium',
      type: 'match'
    },
  ];

  const paymentStatus = {
    totalDue: '€120',
    paidThisMonth: '€240',
    nextDue: 'March 15, 2024',
    status: 'current'
  };

  const recentPurchases = [
    { item: 'Training Jersey - Emma', date: '2 days ago', amount: '€35' },
    { item: 'Soccer Boots - Jake', date: '1 week ago', amount: '€65' },
  ];

  return (
    <div className="space-y-6">
      {/* Parent Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-purple-100">
          Welcome back, {user?.name}! Here's what's happening with your children.
        </p>
      </motion.div>

      {/* Payment Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <SafeIcon icon={FiCheck} className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">Account Status</p>
            <p className="text-lg font-bold text-green-700 capitalize">{paymentStatus.status}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiCreditCard} className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-600 font-medium">Paid This Month</p>
            <p className="text-lg font-bold text-blue-700">{paymentStatus.paidThisMonth}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <SafeIcon icon={FiAlertCircle} className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-orange-600 font-medium">Amount Due</p>
            <p className="text-lg font-bold text-orange-700">{paymentStatus.totalDue}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <SafeIcon icon={FiClock} className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-purple-600 font-medium">Next Due Date</p>
            <p className="text-sm font-bold text-purple-700">{paymentStatus.nextDue}</p>
          </div>
        </div>
      </motion.div>

      {/* Children Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Children</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{child.name}</h4>
                  <p className="text-sm text-gray-600">Age {child.age} • {child.team}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Training:</span>
                  <span className="font-medium">{child.nextTraining}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance:</span>
                  <span className="font-medium text-green-600">{child.attendance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'training' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <SafeIcon 
                      icon={FiCalendar} 
                      className={`h-4 w-4 ${
                        event.type === 'training' ? 'text-blue-600' : 'text-green-600'
                      }`} 
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.event}</h4>
                  <p className="text-sm text-gray-600 mb-2">{event.child}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <SafeIcon icon={FiClock} className="h-3 w-3 mr-1" />
                      {event.date} {event.time}
                    </span>
                    <span className="flex items-center">
                      <SafeIcon icon={FiMapPin} className="h-3 w-3 mr-1" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Purchases */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchases</h3>
          <div className="space-y-4">
            {recentPurchases.map((purchase, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{purchase.item}</h4>
                  <p className="text-sm text-gray-600">{purchase.date}</p>
                </div>
                <span className="font-semibold text-green-600">{purchase.amount}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            View All Purchases
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentDashboard;