import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

const { FiCalendar, FiClock, FiMapPin, FiUsers, FiPlus, FiChevronLeft, FiChevronRight } = FiIcons;

const Calendar = () => {
  const { t } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'K6 Lions Training',
      date: new Date(),
      time: '16:00',
      duration: 90,
      location: 'Field A',
      type: 'training',
      participants: 12,
      coach: 'Sarah Coach'
    },
    {
      id: 2,
      title: 'K10 Eagles vs Blue Stars',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '10:00',
      duration: 90,
      location: 'Main Stadium',
      type: 'match',
      participants: 22,
      coach: 'Mike Coach'
    },
    {
      id: 3,
      title: 'Team Meeting',
      date: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
      time: '18:00',
      duration: 60,
      location: 'Conference Room',
      type: 'meeting',
      participants: 8,
      coach: 'Admin'
    },
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'training': return 'bg-blue-500 text-white';
      case 'match': return 'bg-green-500 text-white';
      case 'meeting': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('calendar')}</h1>
          <p className="text-gray-600 mt-1">Manage your academy schedule and events</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-white rounded-xl shadow-soft p-6 border border-gray-100"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiChevronLeft} className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiChevronRight} className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => {
              const dayEvents = getEventsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 min-h-[80px] border border-gray-100 hover:bg-gray-50 transition-colors relative ${
                    isSelected ? 'bg-primary-50 border-primary-200' : ''
                  } ${!isCurrentMonth ? 'text-gray-300' : ''}`}
                >
                  <span className={`text-sm font-medium ${
                    isCurrentDay ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Event indicators */}
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Event Details Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Selected Date */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h3>
            
            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No events scheduled</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.type === 'training' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'match' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center">
                        <SafeIcon icon={FiClock} className="h-3 w-3 mr-1" />
                        {event.time} ({event.duration} min)
                      </div>
                      <div className="flex items-center">
                        <SafeIcon icon={FiMapPin} className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <SafeIcon icon={FiUsers} className="h-3 w-3 mr-1" />
                        {event.participants} participants
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Training Sessions</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Matches</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Meetings</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Training</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Match</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Meeting</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;