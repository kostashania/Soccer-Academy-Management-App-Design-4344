import React, { useState } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900"
            onClick={onMenuClick}
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg">
            <FiBell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 text-sm rounded-lg p-2 hover:bg-gray-50"
            >
              <img
                className="h-8 w-8 rounded-full"
                src={user?.avatar}
                alt={user?.name}
              />
              <span className="hidden md:block font-medium">{user?.name}</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="py-1">
                  <a
                    href="#/profile"
                    className="flex items-center px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setShowProfile(false)}
                  >
                    <FiUser className="h-4 w-4 mr-3" />
                    Profile
                  </a>
                </div>
                <div className="border-t py-1">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfile && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowProfile(false)}
        />
      )}
    </header>
  );
};

export default Header;