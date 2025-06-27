import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { FiMenu, FiBell, FiSearch, FiSun, FiMoon, FiGlobe } = FiIcons;

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, language, toggleTheme, changeLanguage, t } = useTheme();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={onMenuClick}
          >
            <SafeIcon icon={FiMenu} className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="hidden sm:block ml-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('search')}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={() => changeLanguage(language === 'en' ? 'gr' : 'en')}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          >
            <SafeIcon icon={FiGlobe} className="h-5 w-5" />
            <span className="ml-1 text-sm font-medium">
              {language.toUpperCase()}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          >
            <SafeIcon 
              icon={theme === 'light' ? FiMoon : FiSun} 
              className="h-5 w-5" 
            />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
            <SafeIcon icon={FiBell} className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button className="flex items-center space-x-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={user?.name}
              />
              <span className="hidden md:block text-gray-700 font-medium">
                {user?.name}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;