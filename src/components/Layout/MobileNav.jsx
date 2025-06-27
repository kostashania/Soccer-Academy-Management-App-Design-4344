import React from 'react';
import { NavLink } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';

const { FiHome, FiCalendar, FiCreditCard, FiShoppingBag, FiMessageSquare } = FiIcons;

const MobileNav = () => {
  const { t } = useTheme();

  const navItems = [
    { name: t('dashboard'), href: '/dashboard', icon: FiHome },
    { name: t('calendar'), href: '/calendar', icon: FiCalendar },
    { name: t('payments'), href: '/payments', icon: FiCreditCard },
    { name: t('store'), href: '/store', icon: FiShoppingBag },
    { name: t('messages'), href: '/messages', icon: FiMessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <nav className="flex">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 px-1 text-xs ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <SafeIcon
                  icon={item.icon}
                  className={`h-6 w-6 mb-1 ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNav;