import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiCreditCard, FiShoppingBag, FiMessageSquare, FiUser } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Calendar', href: '/calendar', icon: FiCalendar },
    { name: 'Store', href: '/store', icon: FiShoppingBag },
    { name: 'Messages', href: '/messages', icon: FiMessageSquare },
    { name: 'Profile', href: '/profile', icon: FiUser }
  ];

  // Add payments for admin and parent
  if (['admin', 'parent'].includes(user?.role)) {
    navigationItems.splice(2, 0, { name: 'Payments', href: '/payments', icon: FiCreditCard });
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚽</span>
          </div>
          <span className="ml-3 text-xl font-bold">Soccer Academy</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={user?.avatar}
            alt={user?.name}
          />
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;