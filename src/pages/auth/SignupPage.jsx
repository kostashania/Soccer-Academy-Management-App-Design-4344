import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';

const { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiUserCheck, FiBriefcase, FiGlobe } = FiIcons;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'player',
    phone_number: '',
    address: '',
    company_name: '',
    website_url: '',
    package_type: 'bronze',
    language_preference: 'en'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: formData.role
          }
        }
      });

      if (authError) {
        toast.error(authError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create profile
        const profileData = {
          auth_user_id: authData.user.id,
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          phone_number: formData.phone_number,
          address: formData.address,
          language_preference: formData.language_preference
        };

        // Add sponsor-specific fields
        if (formData.role === 'sponsor') {
          profileData.company_name = formData.company_name;
          profileData.website_url = formData.website_url;
          profileData.package_type = formData.package_type;
        }

        const { error: profileError } = await supabase
          .from('user_profiles_sa2025')
          .insert(profileData);

        if (profileError) {
          toast.error('Error creating profile: ' + profileError.message);
          setLoading(false);
          return;
        }

        toast.success('Account created successfully! You can now login.');
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          password: '',
          role: 'player',
          phone_number: '',
          address: '',
          company_name: '',
          website_url: '',
          package_type: 'bronze',
          language_preference: 'en'
        });
      }
    } catch (error) {
      toast.error('An error occurred during signup: ' + error.message);
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

  const createDemoAccount = async (role, name, email, extraData = {}) => {
    setLoading(true);
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: 'password123',
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });

      if (authError) {
        toast.error(`Failed to create ${role} account: ${authError.message}`);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create profile
        const profileData = {
          auth_user_id: authData.user.id,
          full_name: name,
          email: email,
          role: role,
          phone_number: '+30 123 456 789' + Math.floor(Math.random() * 10),
          address: 'Athens, Greece',
          language_preference: 'en',
          ...extraData
        };

        const { error: profileError } = await supabase
          .from('user_profiles_sa2025')
          .insert(profileData);

        if (profileError) {
          toast.error(`Error creating ${role} profile: ${profileError.message}`);
          setLoading(false);
          return;
        }

        toast.success(`${role} demo account created successfully!`);
      }
    } catch (error) {
      toast.error(`Error creating ${role} account: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { 
      role: 'admin', 
      name: 'Admin Demo', 
      email: 'admin@academy.com' 
    },
    { 
      role: 'manager', 
      name: 'Manager Demo', 
      email: 'manager@academy.com' 
    },
    { 
      role: 'coach', 
      name: 'Coach Demo', 
      email: 'coach@academy.com' 
    },
    { 
      role: 'parent', 
      name: 'Parent Demo', 
      email: 'parent@academy.com' 
    },
    { 
      role: 'player', 
      name: 'Player Demo', 
      email: 'player@academy.com' 
    },
    { 
      role: 'sponsor', 
      name: 'Nike Sponsor', 
      email: 'sponsor@nike.com',
      extraData: {
        company_name: 'Nike Greece',
        website_url: 'https://nike.com',
        package_type: 'gold',
        logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'
      }
    }
  ];

  const quickLogin = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123'
      });

      if (error) {
        toast.error('Login failed: ' + error.message);
        return;
      }

      toast.success('Logged in successfully!');
      window.location.hash = '/dashboard';
    } catch (error) {
      toast.error('Login error: ' + error.message);
    }
  };

  const isSponsor = formData.role === 'sponsor';

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
                onClick={() => createDemoAccount(account.role, account.name, account.email, account.extraData)}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <span className="font-medium capitalize flex items-center">
                  {account.role === 'sponsor' && <SafeIcon icon={FiBriefcase} className="h-4 w-4 mr-2" />}
                  {account.role}
                </span>
                <span className="text-sm text-gray-500">{account.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Login Section */}
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:px-10 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Login (Demo Accounts)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Click to instantly login with demo accounts:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => quickLogin(account.email)}
                className="flex items-center justify-between px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <span className="font-medium text-primary-700 capitalize flex items-center">
                  {account.role === 'sponsor' && <SafeIcon icon={FiBriefcase} className="h-4 w-4 mr-2" />}
                  {account.role}
                </span>
                <span className="text-sm text-primary-600">{account.email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            All demo accounts use password: <code className="bg-gray-100 px-1 rounded">password123</code>
          </p>
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
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
            </div>

            {/* Sponsor-specific fields */}
            {isSponsor && (
              <>
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1 relative">
                    <SafeIcon icon={FiBriefcase} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <div className="mt-1 relative">
                    <SafeIcon icon={FiGlobe} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="website_url"
                      name="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={handleChange}
                      className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="package_type" className="block text-sm font-medium text-gray-700">
                    Sponsor Package
                  </label>
                  <select
                    id="package_type"
                    name="package_type"
                    value={formData.package_type}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="bronze">Bronze Package</option>
                    <option value="silver">Silver Package</option>
                    <option value="gold">Gold Package</option>
                    <option value="custom">Custom Package</option>
                  </select>
                </div>
              </>
            )}

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
              <label htmlFor="language_preference" className="block text-sm font-medium text-gray-700">
                Language Preference
              </label>
              <select
                id="language_preference"
                name="language_preference"
                value={formData.language_preference}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="en">English</option>
                <option value="gr">Ελληνικά</option>
              </select>
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