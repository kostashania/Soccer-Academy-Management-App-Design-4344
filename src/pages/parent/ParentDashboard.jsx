import React from 'react';
import { FiUser, FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const ParentDashboard = () => {
  const { profile } = useAuth();
  const { players, invoices, payments, attendance } = useApp();

  // Filter data for current parent
  const myChildren = players.filter(player => player.parent_id === profile?.user_id);
  const myInvoices = invoices.filter(invoice => 
    myChildren.some(child => child.id === invoice.player_id)
  );

  const getPaymentStatus = (playerId) => {
    const playerInvoices = myInvoices.filter(inv => inv.player_id === playerId);
    const pendingInvoices = playerInvoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');
    const totalDue = pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    
    if (totalDue === 0) return { status: 'current', amount: 0, color: 'green' };
    if (pendingInvoices.some(inv => inv.status === 'overdue')) return { status: 'overdue', amount: totalDue, color: 'red' };
    return { status: 'pending', amount: totalDue, color: 'yellow' };
  };

  const getAttendanceRate = (playerId) => {
    const playerAttendance = attendance.filter(att => att.player_id === playerId);
    if (playerAttendance.length === 0) return 0;
    
    const presentCount = playerAttendance.filter(att => att.status === 'present').length;
    return Math.round((presentCount / playerAttendance.length) * 100);
  };

  const totalDue = myInvoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

  const stats = [
    {
      name: 'My Children',
      value: myChildren.length,
      icon: FiUser,
      color: 'blue'
    },
    {
      name: 'Total Due',
      value: `$${totalDue.toFixed(2)}`,
      icon: FiDollarSign,
      color: totalDue > 0 ? 'red' : 'green'
    },
    {
      name: 'This Month',
      value: myInvoices.filter(inv => 
        new Date(inv.created_at).getMonth() === new Date().getMonth()
      ).length,
      icon: FiCalendar,
      color: 'purple'
    },
    {
      name: 'Avg Attendance',
      value: `${Math.round(myChildren.reduce((sum, child) => sum + getAttendanceRate(child.id), 0) / (myChildren.length || 1))}%`,
      icon: FiTrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-green-100">Welcome back, {profile?.first_name}! Here's your family's status.</p>
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

      {/* Children Status */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">My Children</h3>
        </div>
        <div className="p-6">
          {myChildren.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No children registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myChildren.map((child) => {
                const paymentStatus = getPaymentStatus(child.id);
                const attendanceRate = getAttendanceRate(child.id);
                
                return (
                  <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {child.profile?.first_name?.[0]}{child.profile?.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {child.profile?.first_name} {child.profile?.last_name}
                        </h4>
                        <p className="text-sm text-gray-600">{child.team?.name || 'No team assigned'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full bg-${paymentStatus.color}-100 text-${paymentStatus.color}-800`}>
                          {paymentStatus.status === 'current' ? 'Current' : 
                           paymentStatus.status === 'overdue' ? 'Overdue' : 'Pending'}
                          {paymentStatus.amount > 0 && ` ($${paymentStatus.amount.toFixed(2)})`}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Attendance Rate:</span>
                        <span className={`font-medium ${
                          attendanceRate >= 90 ? 'text-green-600' : 
                          attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {attendanceRate}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          child.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {child.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Child</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Due Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {myInvoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {invoice.player?.profile?.first_name} {invoice.player?.profile?.last_name}
                  </td>
                  <td className="py-4 px-6 font-semibold">${invoice.amount}</td>
                  <td className="py-4 px-6">{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
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

export default ParentDashboard;