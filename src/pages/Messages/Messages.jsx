import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiMessageSquare, FiSend, FiPlus, FiSearch, FiPaperclip, FiMoreVertical, FiCheck, FiCheckCheck, FiClock, FiX } = FiIcons;

const Messages = () => {
  const { t } = useTheme();
  const { user } = useAuth();
  const { conversations, messages, sendMessage, createConversation } = useApp();
  const [selectedConversation, setSelectedConversation] = useState(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = selectedConversation 
    ? messages.filter(msg => msg.conversationId === selectedConversation.id)
    : [];

  const handleSendMessage = () => {
    if (!selectedConversation) {
      toast.error('Please select a conversation first');
      return;
    }

    if (newMessage.trim() || attachment) {
      try {
        sendMessage(
          selectedConversation.id, 
          user.id, 
          user.name, 
          newMessage, 
          attachment ? [attachment] : []
        );
        setNewMessage('');
        setAttachment(null);
        toast.success('Message sent!');
      } catch (error) {
        toast.error('Failed to send message');
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment({
        name: file.name,
        size: file.size,
        type: file.type
      });
      toast.success('File attached!');
    }
  };

  const handleCreateNewChat = () => {
    if (newChatName.trim()) {
      try {
        const newConv = createConversation([user.id], newChatName, 'individual');
        setSelectedConversation(newConv);
        setNewChatName('');
        setShowNewChatModal(false);
        toast.success('New conversation created!');
      } catch (error) {
        toast.error('Failed to create conversation');
      }
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('messages')}</h1>
          <p className="text-gray-600 mt-1">Communicate with coaches, parents, and players</p>
        </div>
        <button 
          onClick={() => setShowNewChatModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          {t('newMessage')}
        </button>
      </motion.div>

      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
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

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((message) => {
                    const isOwn = message.senderId === user.id;
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="text-xs bg-black bg-opacity-10 rounded p-1">
                                  📎 {attachment.name}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            isOwn ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

                <div className="p-4 border-t border-gray-200">
                  {attachment && (
                    <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                      <span className="text-sm">📎 {attachment.name}</span>
                      <button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700">
                        <SafeIcon icon={FiX} className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <SafeIcon icon={FiPaperclip} className="h-5 w-5 text-gray-600" />
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
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
                      disabled={!newMessage.trim() && !attachment}
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

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowNewChatModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Start New Conversation</h3>
                <button onClick={() => setShowNewChatModal(false)} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Conversation name"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewChatModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNewChat}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;