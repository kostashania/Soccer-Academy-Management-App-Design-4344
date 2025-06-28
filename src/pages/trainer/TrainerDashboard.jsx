import React, { useState } from 'react';
import { FiUsers, FiCalendar, FiClipboard, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const TrainerDashboard = () => {
  const { profile, user } = useAuth();
  const { 
    players, 
    teams, 
    trainingSessions, 
    attendance, 
    markAttendance,
    getAttendanceStats 
  } = useApp();

  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter data for current trainer
  const myTeams = teams.filter(team => team.trainer_id === user?.id);
  const myPlayers = players.filter(player => 
    myTeams.some(team => team.id === player.team_id)
  );
  const mySessions = trainingSessions.filter(session =>
    myTeams.some(team => team.id === session.team_id)
  );

  const attendanceStats = getAttendanceStats();

  const handleAttendanceChange = async (playerId, status) => {
    await markAttendance(playerId, attendanceDate, status);
  };

  const getTeamAttendanceRate = (teamId) => {
    const teamPlayers = players.filter(p => p.team_id === teamId);
    if (teamPlayers.length === 0) return 0;

    const totalAttendance = teamPlayers.reduce((sum, player) => {
      const playerAttendance = attendance.filter(att => att.player_id === player.id);
      const presentCount = playerAttendance.filter(att => att.status === 'present').length;
      return sum + (playerAttendance.length > 0 ? (presentCount / playerAttendance.length) : 0);
    }, 0);

    return Math.round((totalAttendance / teamPlayers.length) * 100);
  };

  const stats = [
    {
      name: 'My Teams',
      value: myTeams.length,
      icon: FiUsers,
      color: 'blue'
    },
    {
      name: 'Total Players',
      value: myPlayers.length,
      icon: FiUsers,
      color: 'green'
    },
    {
      name: 'Sessions This Week',
      value: mySessions.filter(session => {
        const sessionDate = new Date(session.start_time);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      }).length,
      icon: FiCalendar,
      color: 'purple'
    },
    {
      name: 'Avg Attendance',
      value: `${attendanceStats.attendanceRate}%`,
      icon: FiTrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Trainer Dashboard</h1>
        <p className="text-blue-100">Welcome back, {profile?.first_name}! Ready to train your teams?</p>
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

      {/* Teams Overview */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">My Teams</h3>
        </div>
        <div className="p-6">
          {myTeams.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No teams assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams.map((team) => {
                const teamPlayers = players.filter(p => p.team_id === team.id);
                const attendanceRate = getTeamAttendanceRate(team.id);
                
                return (
                  <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{team.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Players:</span>
                        <span className="font-medium">{teamPlayers.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-medium text-green-600">
                          {teamPlayers.filter(p => p.is_active).length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Attendance:</span>
                        <span className={`font-medium ${
                          attendanceRate >= 90 ? 'text-green-600' : 
                          attendanceRate >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {attendanceRate}%
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

      {/* Attendance Tracking */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Tracking</h3>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6">
          {myPlayers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No players to track.</p>
          ) : (
            <div className="space-y-4">
              {myTeams.map((team) => {
                const teamPlayers = players.filter(p => p.team_id === team.id && p.is_active);
                if (teamPlayers.length === 0) return null;
                
                return (
                  <div key={team.id}>
                    <h4 className="font-medium text-gray-900 mb-3">{team.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamPlayers.map((player) => {
                        const playerAttendance = attendance.find(att => 
                          att.player_id === player.id && 
                          att.training_date === attendanceDate
                        );
                        
                        return (
                          <div key={player.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">
                                {player.profile?.first_name} {player.profile?.last_name}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAttendanceChange(player.id, 'present')}
                                className={`flex-1 py-1 px-2 text-xs rounded ${
                                  playerAttendance?.status === 'present'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(player.id, 'absent')}
                                className={`flex-1 py-1 px-2 text-xs rounded ${
                                  playerAttendance?.status === 'absent'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                                }`}
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(player.id, 'excused')}
                                className={`flex-1 py-1 px-2 text-xs rounded ${
                                  playerAttendance?.status === 'excused'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                                }`}
                              >
                                Excused
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;