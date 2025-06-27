import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const { 
  FiMessageSquare, FiSend, FiPlus, FiSearch, FiPaperclip, 
  FiMoreVertical, FiCheck, FiCheckCheck, FiClock 
} = FiIcons;

const Messages = () => {
  const { t } = useTheme();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Coach',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c78d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Training session moved to 5 PM tomorrow',
      time: '2 hours ago',
      unread: 2,
      online: true,
      type: 'individual'
    },
    {
      id: 2,
      name: 'K6 Lions Team',
      avatar: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=150&h=150&fit=crop',
      lastMessage: 'Great practice today everyone!',
      time: '4 hours ago',
      unread: 0,
      online: false,
      type: 'group'
    },
    {
      id: 3,
      name: 'Mike Johnson (Parent)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastMessage: 'Thanks for the update on Emma\'s progress',
      time: '1 day ago',
      unread: 0,
      online: false,
      type: 'individual'
    },
    {
      id: 4,
      name: 'Coaches Group',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
      lastMessage: 'Meeting scheduled for next week',
      time: '2 days ago',
      unread: 1,
      online: false,
      type: 'group'
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: 2,
      senderName: 'Sarah Coach',
      content: 'Hi! Just wanted to let you know that tomorrow\'s training session has been moved to 5 PM due to field maintenance.',
      timestamp: '2024-03-15T14:30:00Z',
      status: 'delivered'
    },
    {
      id: 2,
      senderId: 1,
      senderName: user?.name,
      content: 'Thanks for letting me know! Will Emma need to bring anything special for the training?',
      timestamp: '2024-03-15T14:32:00Z',
      status: 'read'
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'Sarah Coach',
      content: 'Just the usual equipment - boots, water bottle, and a positive attitude! 😊',
      timestamp: '2024-03-15T14:35:00Z',
      status: 'delivered'
    },
    {
      id: 4,
      senderId: 1,
      senderName: user?.name,
      content: 'Perfect! See you tomorrow at 5 PM then.',
      timestamp: '2024-03-15T14:36:00Z',
      status: 'read'
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return FiCheck;
      case 'delivered': return FiCheck;
      case 'read': return FiCheckCheck;
      default: return FiClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-gray-400';
      case 'delivered': return 'text-gray-400';
      case 'read': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('messages')}</h1>
          <p className="text-gray-600 mt-1">Communicate with coaches, parents, and players</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
            {t('newMessage')}
          </button>
        </div>
      </motion.div>

      {/* Messages Interface */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-primary-50 border-r-2 border-primary-600' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-500">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="ml-2 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {conversation.unread}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.online ? 'Online' : 'Last seen 2 hours ago'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <SafeIcon icon={FiMoreVertical} className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === 1; // Assuming current user ID is 1
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            isOwn ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isOwn && (
                              <SafeIcon 
                                icon={getStatusIcon(message.status)} 
                                className={`h-3 w-3 ${getStatusColor(message.status)}`} 
                              />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <SafeIcon icon={FiPaperclip} className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SafeIcon icon={FiSend} className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <SafeIcon icon={FiMessageSquare} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;