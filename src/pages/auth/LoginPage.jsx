import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
    } else {
      toast.error(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const quickLogin = async (email) => {
    setLoading(true);
    const result = await login(email, 'password123');
    
    if (result.success) {
      toast.success('Login successful!');
    } else {
      toast.error('Login failed');
    }
    
    setLoading(false);
  };

  const demoAccounts = [
    { role: 'admin', email: 'admin@academy.com', name: 'Admin Demo' },
    { role: 'coach', email: 'coach@academy.com', name: 'Coach Demo' },
    { role: 'parent', email: 'parent@academy.com', name: 'Parent Demo' },
    { role: 'player', email: 'player@academy.com', name: 'Player Demo' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative">
        <img
          src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop"
          alt="Soccer Academy"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Soccer Academy</h1>
          <p className="text-xl">Professional management system for modern soccer academies.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your Soccer Academy account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-4 text-center">Quick demo login:</p>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => quickLogin(account.email)}
                  disabled={loading}
                  className="flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <span className="font-medium text-blue-700 capitalize">{account.name}</span>
                  <span className="text-sm text-blue-600">{account.email}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              All demo accounts use password: <code className="bg-gray-100 px-1 rounded">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;