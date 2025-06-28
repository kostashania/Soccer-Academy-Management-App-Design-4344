import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Dashboard from '../Dashboard/Dashboard';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiUsers, FiBarChart2, FiPackage, FiDollarSign, FiMegaphone, FiSettings, FiHome, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiTag, FiX } = FiIcons;

// Simple placeholder components for admin sections
const UsersManagement = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-4">Users Management</h2>
    <p className="text-gray-600">Manage all users in the system</p>
    <div className="mt-6 bg-gray-50 p-8 rounded-lg text-center">
      <SafeIcon icon={FiUsers} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Users management interface will be implemented here</p>
    </div>
  </div>
);

const LocationsManagement = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-4">Locations Management</h2>
    <p className="text-gray-600">Manage training locations and facilities</p>
    <div className="mt-6 bg-gray-50 p-8 rounded-lg text-center">
      <SafeIcon icon={FiMapPin} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Locations management interface will be implemented here</p>
    </div>
  </div>
);

const CategoriesManagement = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-4">Categories Management</h2>
    <p className="text-gray-600">Manage product categories and classifications</p>
    <div className="mt-6 bg-gray-50 p-8 rounded-lg text-center">
      <SafeIcon icon={FiTag} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Categories management interface will be implemented here</p>
    </div>
  </div>
);

const SponsorsManagement = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-4">Sponsors Management</h2>
    <p className="text-gray-600">Manage sponsors and partnerships</p>
    <div className="mt-6 bg-gray-50 p-8 rounded-lg text-center">
      <SafeIcon icon={FiMegaphone} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">Sponsors management interface will be implemented here</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();

  const adminTabs = [
    { name: 'Overview', href: '/admin', icon: FiHome, exact: true },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Inventory', href: '/admin/inventory', icon: FiPackage },
    { name: 'Locations', href: '/admin/locations', icon: FiMapPin },
    { name: 'Categories', href: '/admin/categories', icon: FiTag },
    { name: 'Finance', href: '/admin/finance', icon: FiDollarSign },
    { name: 'Sponsors', href: '/admin/sponsors', icon: FiMegaphone },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">Complete control and management of your soccer academy</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <nav className="flex space-x-1 p-2 overflow-x-auto">
          {adminTabs.map((tab) => {
            const isActive = tab.exact 
              ? location.pathname === '/dashboard' || location.pathname === tab.href
              : location.pathname.startsWith(tab.href);
            
            return (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-4 w-4 mr-2" />
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/analytics" element={<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-2xl font-bold">Analytics Coming Soon</h2></div>} />
          <Route path="/inventory" element={<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-2xl font-bold">Inventory Management - Use Store page</h2></div>} />
          <Route path="/locations" element={<LocationsManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/finance" element={<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-2xl font-bold">Finance Coming Soon</h2></div>} />
          <Route path="/sponsors" element={<SponsorsManagement />} />
          <Route path="/settings" element={<div className="bg-white rounded-xl shadow-sm p-6"><h2 className="text-2xl font-bold">Settings Coming Soon</h2></div>} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;