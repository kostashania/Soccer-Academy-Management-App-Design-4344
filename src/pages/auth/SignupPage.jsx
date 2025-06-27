import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { authService } from '../../services/supabaseService';
import { toast } from 'react-toastify';

const { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiUserCheck } = FiIcons;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'player',
    phone_number: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authService.signUp(
        formData.email, 
        formData.password, 
        {
          full_name: formData.full_name,
          role: formData.role,
          phone_number: formData.phone_number,
          address: formData.address
        }
      );

      if (error) {
        toast.error(error.message || 'Signup failed');
      } else {
        toast.success('Account created successfully! You can now login.');
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          password: '',
          role: 'player',
          phone_number: '',
          address: ''
        });
      }
    } catch (error) {
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createDemoAccount = async (role, name, email) => {
    setLoading(true);
    try {
      const { data, error } = await authService.signUp(
        email,
        'password123',
        {
          full_name: name,
          role: role,
          phone_number: '+30 123 456 789' + Math.floor(Math.random() * 10),
          address: 'Athens, Greece'
        }
      );

      if (error) {
        toast.error(`Failed to create ${role} account: ${error.message}`);
      } else {
        toast.success(`${role} demo account created successfully!`);
      }
    } catch (error) {
      toast.error(`Error creating ${role} account`);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'admin', name: 'Admin Demo', email: 'admin@academy.com' },
    { role: 'manager', name: 'Manager Demo', email: 'manager@academy.com' },
    { role: 'coach', name: 'Coach Demo', email: 'coach@academy.com' },
    { role: 'parent', name: 'Parent Demo', email: 'parent@academy.com' },
    { role: 'player', name: 'Player Demo', email: 'player@academy.com' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Demo Accounts
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create demo accounts to test the Soccer Academy system
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Demo Account Creation */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Demo Setup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Click to create all demo accounts with one click each:
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                onClick={() => createDemoAccount(account.role, account.name, account.email)}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <span className="font-medium capitalize">{account.role}</span>
                <span className="text-sm text-gray-500">{account.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Account Creation */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Account Creation</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1 relative">
                <SafeIcon icon={FiUserCheck} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="player">Player</option>
                  <option value="parent">Parent</option>
                  <option value="coach">Coach</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="board_member">Board Member</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1 relative">
                <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;