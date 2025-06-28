import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { signIn, signUp, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'parent'
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(formData.email, formData.password, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          role: formData.role
        });

        if (result.success) {
          toast.success('Account created successfully!');
          setIsSignUp(false);
        } else {
          toast.error(result.error || 'Failed to create account');
        }
      } else {
        const result = await signIn(formData.email, formData.password);
        if (result.success) {
          toast.success('Login successful!');
        } else {
          toast.error(result.error || 'Login failed');
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, role) => {
    setLoading(true);
    const result = await signIn(email, 'password123');
    if (result.success) {
      toast.success(`${role} demo login successful!`);
    } else {
      toast.error('Demo login failed');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@youthsports.com', name: 'Super Admin' },
    { role: 'Coach', email: 'trainer@youthsports.com', name: 'Trainer Demo' },
    { role: 'Parent', email: 'parent@youthsports.com', name: 'Parent Demo' },
    { role: 'Player', email: 'player@youthsports.com', name: 'Player Demo' },
    { role: 'Sponsor', email: 'sponsor@nike.com', name: 'Nike Sponsor' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative">
        <img 
          src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop" 
          alt="Youth Sports" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
        />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">Youth Sports Management</h1>
          <p className="text-xl">Complete platform for managing youth sports organizations with financial control and status tracking.</p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Sign up for your Youth Sports Management account' 
                : 'Sign in to your Youth Sports Management account'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="parent">Parent</option>
                    <option value="trainer">Trainer</option>
                    <option value="player">Player</option>
                    <option value="admin">Administrator</option>
                    <option value="sponsor">Sponsor</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-4 text-center">Quick demo login:</p>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => quickLogin(account.email, account.role)}
                  disabled={loading}
                  className="flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <span className="font-medium text-blue-700">{account.name}</span>
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