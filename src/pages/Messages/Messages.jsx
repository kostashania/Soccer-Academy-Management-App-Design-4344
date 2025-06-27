import React from 'react';
import { FiSend } from 'react-icons/fi';

const Messages = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-600">Communicate with coaches, parents, and players</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          New Message
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex h-[600px]">
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Conversations</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop"
                    alt="General Chat"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">General Chat</h4>
                    <p className="text-sm text-gray-600">Welcome to the academy!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">General Chat</h3>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">Welcome to the Soccer Academy!</p>
                  <p className="text-xs text-gray-500 mt-1">10:00 AM</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;