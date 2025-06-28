import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiBarChart2, FiSettings, FiMessageSquare, FiUser, FiClipboard } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onClose }) => {
  const { profile } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: FiHome },
      { name: 'Calendar', href: '/calendar', icon: FiCalendar },
      { name: 'Messages', href: '/messages', icon: FiMessageSquare },
      { name: 'Profile', href: '/profile', icon: FiUser }
    ];

    // Role-specific navigation
    switch (profile?.role) {
      case 'admin':
        return [
          ...baseItems,
          { name: 'Players', href: '/players', icon: FiUsers },
          { name: 'Teams', href: '/teams', icon: FiUsers },
          { name: 'Invoices', href: '/invoices', icon: FiDollarSign },
          { name: 'Payments', href: '/payments', icon: FiDollarSign },
          { name: 'Reports', href: '/reports', icon: FiBarChart2 },
          { name: 'Settings', href: '/settings', icon: FiSettings }
        ];
      case 'trainer':
        return [
          ...baseItems,
          { name: 'My Teams', href: '/my-teams', icon: FiUsers },
          { name: 'Attendance', href: '/attendance', icon: FiClipboard },
          { name: 'Training Sessions', href: '/training-sessions', icon: FiCalendar }
        ];
      case 'parent':
        return [
          ...baseItems,
          { name: 'My Children', href: '/my-children', icon: FiUsers },
          { name: 'Payments', href: '/payments', icon: FiDollarSign }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚽</span>
          </div>
          <span className="ml-3 text-xl font-bold">Youth Sports</span>
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
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;