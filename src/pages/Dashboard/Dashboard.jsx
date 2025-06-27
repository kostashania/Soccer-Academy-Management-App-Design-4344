import React from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { users, events, payments, products } = useData();

  const stats = [
    {
      name: 'Total Players',
      value: users.filter(u => u.role === 'player').length.toString(),
      icon: FiUsers,
      color: 'blue'
    },
    {
      name: 'Upcoming Events',
      value: events.length.toString(),
      icon: FiCalendar,
      color: 'green'
    },
    {
      name: 'Total Revenue',
      value: `€${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'purple'
    },
    {
      name: 'Products',
      value: products.length.toString(),
      icon: FiTrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Here's what's happening at your soccer academy today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{payment.studentName}</p>
                  <p className="text-sm text-gray-600">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{payment.amount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;