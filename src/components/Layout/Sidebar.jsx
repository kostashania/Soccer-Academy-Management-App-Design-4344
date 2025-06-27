import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

const {
  FiHome, FiCalendar, FiCreditCard, FiShoppingBag, FiMessageSquare, FiUser, FiSettings,
  FiUsers, FiBarChart3, FiPackage, FiDollarSign, FiMegaphone, FiShoppingCart, FiMapPin, FiTag,
  FiBriefcase, FiTrendingUp, FiImage
} = FiIcons;

const Sidebar = ({ mobile, onClose }) => {
  const { user } = useAuth();
  const { t } = useTheme();
  const { cartItems } = useApp();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: t('dashboard'), href: '/dashboard', icon: FiHome },
      { name: t('calendar'), href: '/calendar', icon: FiCalendar },
      { name: t('store'), href: '/store', icon: FiShoppingBag },
      { name: 'My Cart', href: '/cart', icon: FiShoppingCart, badge: cartItems.length }
    ];

    // Add role-specific items
    if (['admin', 'manager', 'parent'].includes(user?.role)) {
      baseItems.splice(2, 0, { name: t('payments'), href: '/payments', icon: FiCreditCard });
    }

    if (['admin', 'manager', 'coach', 'parent', 'player'].includes(user?.role)) {
      baseItems.push({ name: t('messages'), href: '/messages', icon: FiMessageSquare });
    }

    const roleSpecificItems = {
      admin: [
        { name: 'Users', href: '/admin/users', icon: FiUsers },
        { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart3 },
        { name: 'Inventory', href: '/admin/inventory', icon: FiPackage },
        { name: 'Locations', href: '/admin/locations', icon: FiMapPin },
        { name: 'Categories', href: '/admin/categories', icon: FiTag },
        { name: 'Finance', href: '/admin/finance', icon: FiDollarSign },
        { name: 'Sponsors', href: '/admin/sponsors', icon: FiMegaphone },
        { name: 'Settings', href: '/admin/settings', icon: FiSettings }
      ],
      coach: [
        { name: 'My Teams', href: '/coach/teams', icon: FiUsers },
        { name: 'Training', href: '/coach/training', icon: FiCalendar }
      ],
      manager: [
        { name: 'Staff', href: '/manager/staff', icon: FiUsers },
        { name: 'Reports', href: '/manager/reports', icon: FiBarChart3 }
      ],
      parent: [
        { name: 'My Children', href: '/parent/children', icon: FiUsers }
      ],
      sponsor: [
        { name: 'My Ads', href: '/sponsor/ads', icon: FiImage },
        { name: 'Analytics', href: '/sponsor/analytics', icon: FiTrendingUp },
        { name: 'Company Info', href: '/sponsor/company', icon: FiBriefcase }
      ]
    };

    return [
      ...baseItems,
      ...(roleSpecificItems[user?.role] || []),
      { name: t('profile'), href: '/profile', icon: FiUser }
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚽</span>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">
            Soccer Academy
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={mobile ? onClose : undefined}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {({ isActive }) => (
                <>
                  <SafeIcon
                    icon={item.icon}
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={user?.avatar || user?.logo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
            alt={user?.name}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.company_name || user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;