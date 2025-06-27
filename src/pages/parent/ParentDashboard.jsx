import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const { FiUser, FiCalendar, FiCreditCard, FiTrendingUp, FiClock, FiMapPin, FiCheck, FiAlertCircle } = FiIcons;

const ParentDashboard = () => {
  const { user } = useAuth();
  const { students, users, events, payments } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Get children for this parent
  const myChildren = students.filter(student => student.parentId === user?.id) || [
    { id: '1', name: 'Emma Johnson', age: 8, team: 'K6 Lions', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
    { id: '2', name: 'Jake Johnson', age: 12, team: 'K10 Eagles', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face' }
  ];

  // Get upcoming events for children
  const upcomingEvents = events.filter(event => 
    myChildren.some(child => event.participants?.includes(child.name))
  ).slice(0, 5);

  // Get payment information
  const myPayments = payments.filter(payment => payment.parentName === user?.name);
  const totalDue = myPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const paidThisMonth = myPayments.filter(p => p.status === 'paid' && new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0);

  const paymentStatus = {
    totalDue: `€${totalDue}`,
    paidThisMonth: `€${paidThisMonth}`,
    nextDue: 'March 15, 2024',
    status: totalDue === 0 ? 'current' : 'pending'
  };

  const MyChildrenTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">My Children</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myChildren.map((child) => (
          <div key={child.id} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <img src={child.avatar} alt={child.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="text-xl font-bold text-gray-900">{child.name}</h4>
                <p className="text-gray-600">Age {child.age} • {child.team}</p>
              </div>
            </div>

            {/* Child's upcoming events */}
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Upcoming Events</h5>
              <div className="space-y-2">
                {events.filter(event => event.participants?.includes(child.name)).slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'training' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">95%</div>
                <div className="text-xs text-green-600">Attendance</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">4.8</div>
                <div className="text-xs text-blue-600">Performance</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Parent Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-purple-100">Welcome back, {user?.name}! Here's what's happening with your children.</p>
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

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'children', name: 'My Children' },
            { id: 'payments', name: 'Payments' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Children Overview */}
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Children</h3>
              <div className="space-y-4">
                {myChildren.map((child) => (
                  <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <img src={child.avatar} alt={child.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{child.name}</h4>
                        <p className="text-sm text-gray-600">Age {child.age} • {child.team}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next Training:</span>
                        <span className="font-medium">Today 4:00 PM</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Attendance:</span>
                        <span className="font-medium text-green-600">95%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg ${event.type === 'training' ? 'bg-blue-50' : 'bg-green-50'}`}>
                        <SafeIcon icon={FiCalendar} className={`h-4 w-4 ${event.type === 'training' ? 'text-blue-600' : 'text-green-600'}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">For: {event.participants?.join(', ')}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <SafeIcon icon={FiClock} className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleDateString()} {event.time}
                        </span>
                        <span className="flex items-center">
                          <SafeIcon icon={FiMapPin} className="h-3 w-3 mr-1" />
                          Location
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'children' && <MyChildrenTab />}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100">
                      <td className="py-4 px-4 font-medium text-gray-900">{payment.studentName}</td>
                      <td className="py-4 px-4 font-semibold text-gray-900">€{payment.amount.toFixed(2)}</td>
                      <td className="py-4 px-4 text-gray-600">{payment.date}</td>
                      <td className="py-4 px-4">
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
        )}
      </motion.div>
    </div>
  );
};

export default ParentDashboard;