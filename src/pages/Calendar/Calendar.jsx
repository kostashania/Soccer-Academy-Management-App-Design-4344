import React from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';

const Calendar = () => {
  const { events } = useData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-gray-600">Manage your academy schedule and events</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FiCalendar className="h-4 w-4 mr-1" />
                      {event.date}
                    </span>
                    <span className="flex items-center">
                      <FiClock className="h-4 w-4 mr-1" />
                      {event.time}
                    </span>
                    <span className="flex items-center">
                      <FiMapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  event.type === 'training' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;