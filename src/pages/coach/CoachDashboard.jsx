import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const { FiUsers, FiCalendar, FiClipboard, FiTrendingUp, FiClock, FiMapPin } = FiIcons;

const CoachDashboard = () => {
  const { user } = useAuth();
  const { users, events } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  // Get teams for this coach
  const myTeams = [
    { name: 'K6 Lions', players: users.filter(u => u.team === 'K6 Lions').length, nextTraining: 'Today 4:00 PM' },
    { name: 'K10 Eagles', players: users.filter(u => u.team === 'K10 Eagles').length, nextTraining: 'Tomorrow 3:00 PM' },
  ];

  // Get upcoming sessions for this coach
  const upcomingSessions = events.filter(event => event.coach === user?.name).slice(0, 5);

  // Get players for performance tracking
  const myPlayers = users.filter(user => user.role === 'player');

  const TeamManagement = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
      {myTeams.map((team, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-900">{team.name}</h4>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {team.players} players
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900">Next Training</h5>
              <p className="text-sm text-gray-600">{team.nextTraining}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900">Attendance Rate</h5>
              <p className="text-sm text-gray-600">92%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900">Performance</h5>
              <p className="text-sm text-gray-600">Excellent</p>
            </div>
          </div>
          <div className="mt-4">
            <h5 className="font-medium text-gray-900 mb-2">Recent Players</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {myPlayers.filter(p => p.team === team.name).slice(0, 8).map((player) => (
                <div key={player.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <img src={player.avatar} alt={player.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium truncate">{player.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TrainingManagement = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Training Sessions</h3>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Upcoming Sessions</h4>
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h5 className="font-medium text-gray-900">{session.title}</h5>
                <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()} at {session.time}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  session.type === 'training' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {session.type}
                </span>
                <p className="text-sm text-gray-600 mt-1">{session.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Training Statistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{events.filter(e => e.type === 'training' && e.coach === user?.name).length}</div>
            <div className="text-sm text-blue-600">Total Sessions</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-sm text-green-600">Avg Attendance</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-purple-600">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Coach Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white animate-fadeIn">
        <h1 className="text-2xl font-bold mb-2">Coach Dashboard</h1>
        <p className="text-green-100">Welcome back, {user?.name}! Ready to train your teams?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'My Teams', value: myTeams.length.toString(), icon: FiUsers, color: 'blue' },
          { name: 'Total Players', value: myPlayers.length.toString(), icon: FiUsers, color: 'green' },
          { name: 'This Week Sessions', value: upcomingSessions.length.toString(), icon: FiCalendar, color: 'purple' },
          { name: 'Avg Attendance', value: '92%', icon: FiTrendingUp, color: 'orange' },
        ].map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
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
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'teams', name: 'My Teams' },
            { id: 'training', name: 'Training' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Teams Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <SafeIcon icon={FiCalendar} className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <SafeIcon icon={FiClock} className="h-3 w-3 mr-1" />
                          {new Date(session.date).toLocaleDateString()} {session.time}
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
        {activeTab === 'teams' && <TeamManagement />}
        {activeTab === 'training' && <TrainingManagement />}
      </div>
    </div>
  );
};

export default CoachDashboard;