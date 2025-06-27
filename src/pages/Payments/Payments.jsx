import React from 'react';
import { FiDollarSign, FiCheck, FiClock } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';

const Payments = () => {
  const { payments } = useData();

  const stats = [
    {
      name: 'Total Revenue',
      value: `€${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'blue'
    },
    {
      name: 'Paid Payments',
      value: payments.filter(p => p.status === 'paid').length.toString(),
      icon: FiCheck,
      color: 'green'
    },
    {
      name: 'Pending Payments',
      value: payments.filter(p => p.status === 'pending').length.toString(),
      icon: FiClock,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-600">Manage payments and subscriptions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
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

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Parent</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{payment.studentName}</td>
                  <td className="py-4 px-6">{payment.parentName}</td>
                  <td className="py-4 px-6 font-semibold">€{payment.amount.toFixed(2)}</td>
                  <td className="py-4 px-6">{payment.date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
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

export default Payments;