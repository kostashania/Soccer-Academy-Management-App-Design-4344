import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Dashboard from '../Dashboard/Dashboard';

const { 
  FiUsers, FiBarChart3, FiPackage, FiDollarSign, 
  FiMegaphone, FiSettings, FiHome 
} = FiIcons;

// Admin Components
const UsersManagement = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold mb-6">Users Management</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">156</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Active Players</h3>
          <p className="text-2xl font-bold text-green-600">142</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Staff Members</h3>
          <p className="text-2xl font-bold text-purple-600">14</p>
        </div>
      </div>
    </div>
  </div>
);

const Analytics = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <p className="text-3xl font-bold">€12,450</p>
        <p className="text-blue-100">+15% from last month</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-2">Training Sessions</h3>
        <p className="text-3xl font-bold">87</p>
        <p className="text-green-100">This month</p>
      </div>
    </div>
  </div>
);

const Inventory = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-900">Low Stock Items</h3>
          <p className="text-2xl font-bold text-orange-600">5</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Total Items</h3>
          <p className="text-2xl font-bold text-blue-600">234</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Items Sold</h3>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Total Value</h3>
          <p className="text-2xl font-bold text-purple-600">€5,670</p>
        </div>
      </div>
    </div>
  </div>
);

const Finance = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold mb-6">Financial Management</h2>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">€45,230</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Pending Payments</h3>
          <p className="text-2xl font-bold text-blue-600">€2,450</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-900">Outstanding</h3>
          <p className="text-2xl font-bold text-orange-600">€890</p>
        </div>
      </div>
    </div>
  </div>
);

const Sponsors = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold mb-6">Sponsor Management</h2>
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Active Sponsors</h3>
          <p className="text-2xl font-bold text-blue-600">8</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Sponsor Revenue</h3>
          <p className="text-2xl font-bold text-green-600">€3,200</p>
        </div>
      </div>
    </div>
  </div>
);

const AdminSettings = () => (
  <div className="bg-white rounded-xl shadow-soft p-6">
    <h2 className="text-2xl font-bold mb-6">System Settings</h2>
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="ml-2">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="ml-2">SMS notifications</span>
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Academy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="ml-2">Auto payment reminders</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded" />
              <span className="ml-2">Public calendar</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();
  
  const adminTabs = [
    { name: 'Overview', href: '/admin', icon: FiHome, exact: true },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart3 },
    { name: 'Inventory', href: '/admin/inventory', icon: FiPackage },
    { name: 'Finance', href: '/admin/finance', icon: FiDollarSign },
    { name: 'Sponsors', href: '/admin/sponsors', icon: FiMegaphone },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">
          Complete control and management of your soccer academy
        </p>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
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

      {/* Admin Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;