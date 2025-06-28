import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiCalendar, FiTrendingUp, FiTarget, FiAward, FiClock, FiMapPin, FiUsers, FiActivity } = FiIcons;

const PlayerDashboard = () => {
  const { user } = useAuth();

  const playerStats = {
    team: 'K10 Eagles',
    position: 'Midfielder',
    attendance: '92%',
    rating: 4.6,
    goalsScored: 8,
    matchesPlayed: 15
  };

  const upcomingEvents = [
    {
      type: 'training',
      title: 'Team Training',
      date: 'Today',
      time: '4:00 PM',
      location: 'Field A',
      coach: 'Sarah Coach'
    },
    {
      type: 'match',
      title: 'Match vs Blue Stars',
      date: 'Saturday',
      time: '10:00 AM',
      location: 'Main Stadium',
      coach: 'Sarah Coach'
    },
  ];

  const recentPerformance = [
    {
      date: 'Last Match',
      performance: 'Excellent',
      rating: 4.8,
      notes: 'Great teamwork and passing'
    },
    {
      date: 'Training',
      performance: 'Good',
      rating: 4.2,
      notes: 'Improved ball control'
    },
    {
      date: 'Match',
      performance: 'Very Good',
      rating: 4.5,
      notes: 'Scored 2 goals'
    },
  ];

  const achievements = [
    {
      title: 'Player of the Month',
      date: 'February 2024',
      icon: FiAward
    },
    {
      title: 'Top Scorer',
      date: 'January 2024',
      icon: FiTarget
    },
    {
      title: 'Perfect Attendance',
      date: 'December 2023',
      icon: FiTrendingUp
    },
  ];

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white animate-fadeIn">
        <div className="flex items-center space-x-4">
          <img 
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'} 
            alt={user?.name} 
            className="w-16 h-16 rounded-full object-cover border-4 border-white/20" 
          />
          <div>
            <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
            <p className="text-blue-100">{playerStats.team} • {playerStats.position}</p>
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Attendance', value: playerStats.attendance, icon: FiTrendingUp, color: 'green' },
          { name: 'Rating', value: playerStats.rating, icon: FiAward, color: 'yellow' },
          { name: 'Goals Scored', value: playerStats.goalsScored, icon: FiTarget, color: 'red' },
          { name: 'Matches Played', value: playerStats.matchesPlayed, icon: FiActivity, color: 'blue' },
        ].map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.name}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                <SafeIcon icon={stat.icon} className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-slideLeft">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Schedule</h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'training' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <SafeIcon icon={FiCalendar} className={`h-4 w-4 ${
                      event.type === 'training' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">Coach: {event.coach}</p>
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
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    event.type === 'training' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-slideRight">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <SafeIcon icon={achievement.icon} className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-fadeIn">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Coach Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentPerformance.map((performance, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{performance.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      performance.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                      performance.performance === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {performance.performance}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="font-medium">{performance.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{performance.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;