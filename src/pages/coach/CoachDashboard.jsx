import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiUsers, FiCalendar, FiClipboard, FiTrendingUp, FiClock, FiMapPin } = FiIcons;

const CoachDashboard = () => {
  const { user } = useAuth();

  const myTeams = [
    { name: 'K6 Lions', players: 12, nextTraining: 'Today 4:00 PM' },
    { name: 'K10 Eagles', players: 15, nextTraining: 'Tomorrow 3:00 PM' },
  ];

  const upcomingSessions = [
    {
      team: 'K6 Lions',
      date: 'Today',
      time: '4:00 PM',
      location: 'Field A',
      type: 'Training'
    },
    {
      team: 'K10 Eagles',
      date: 'Tomorrow',
      time: '3:00 PM',
      location: 'Field B',
      type: 'Match'
    },
  ];

  const playerPerformance = [
    { name: 'Alex Johnson', team: 'K6 Lions', attendance: '95%', rating: 4.8 },
    { name: 'Maria Garcia', team: 'K10 Eagles', attendance: '90%', rating: 4.6 },
    { name: 'David Smith', team: 'K6 Lions', attendance: '88%', rating: 4.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Coach Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Coach Dashboard</h1>
        <p className="text-green-100">
          Welcome back, {user?.name}! Ready to train your teams?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'My Teams', value: '2', icon: FiUsers, color: 'blue' },
          { name: 'Total Players', value: '27', icon: FiUsers, color: 'green' },
          { name: 'This Week Sessions', value: '8', icon: FiCalendar, color: 'purple' },
          { name: 'Avg Attendance', value: '92%', icon: FiTrendingUp, color: 'orange' },
        ].map((stat, index) => (
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
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Teams */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Teams</h3>
          <div className="space-y-4">
            {myTeams.map((team, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{team.name}</h4>
                  <p className="text-sm text-gray-600">{team.players} players</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Next Training</p>
                  <p className="text-sm text-gray-600">{team.nextTraining}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <SafeIcon icon={FiCalendar} className="h-4 w-4 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{session.team}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <SafeIcon icon={FiClock} className="h-3 w-3 mr-1" />
                      {session.date} {session.time}
                    </span>
                    <span className="flex items-center">
                      <SafeIcon icon={FiMapPin} className="h-3 w-3 mr-1" />
                      {session.location}
                    </span>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    session.type === 'Training' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {session.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Player Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Player</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Team</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Attendance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody>
              {playerPerformance.map((player, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{player.name}</td>
                  <td className="py-3 px-4 text-gray-600">{player.team}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {player.attendance}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-medium">{player.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachDashboard;