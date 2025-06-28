import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { DataProvider } from './contexts/DataContext';

// Layout Components
import Layout from './components/Layout/Layout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import CoachDashboard from './pages/coach/CoachDashboard';
import PlayerDashboard from './pages/player/PlayerDashboard';
import SponsorDashboard from './pages/sponsor/SponsorDashboard';

// Feature Pages
import Calendar from './pages/Calendar/Calendar';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';
import Payments from './pages/Payments/Payments';
import Store from './pages/Store/Store';
import Cart from './pages/Cart/Cart';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { profile, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AuthGuard = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
};

const DashboardRouter = () => {
  const { profile } = useAuth();

  switch (profile?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'trainer':
    case 'coach':
      return <CoachDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'player':
      return <PlayerDashboard />;
    case 'sponsor':
      return <SponsorDashboard />;
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppProvider>
          <Router>
            <div className="App min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    <AuthGuard>
                      <LoginPage />
                    </AuthGuard>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          {/* Dashboard Routes */}
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<DashboardRouter />} />

                          {/* Common Routes - All Roles */}
                          <Route path="/calendar" element={<Calendar />} />
                          <Route path="/messages" element={<Messages />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/payments" element={<Payments />} />
                          <Route path="/store" element={<Store />} />
                          <Route path="/cart" element={<Cart />} />

                          {/* Admin Only Routes */}
                          <Route 
                            path="/admin/*" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/players" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">Players Management</h1>
                                  <p className="text-gray-600 mt-2">Manage all players in the academy</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Players management interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/teams" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">Teams Management</h1>
                                  <p className="text-gray-600 mt-2">Organize and manage teams</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Teams management interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/invoices" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">Invoice Management</h1>
                                  <p className="text-gray-600 mt-2">Generate and manage invoices</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Invoice management interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/reports" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                                  <p className="text-gray-600 mt-2">Financial and performance reports</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Reports interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/settings" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">System Settings</h1>
                                  <p className="text-gray-600 mt-2">Configure academy settings</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Settings interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />

                          {/* Trainer/Coach Routes */}
                          <Route 
                            path="/my-teams" 
                            element={
                              <ProtectedRoute allowedRoles={['trainer', 'coach']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">My Teams</h1>
                                  <p className="text-gray-600 mt-2">Teams you are coaching</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">My teams interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/attendance" 
                            element={
                              <ProtectedRoute allowedRoles={['trainer', 'coach']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">Attendance Tracking</h1>
                                  <p className="text-gray-600 mt-2">Track player attendance</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Attendance tracking interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/training-sessions" 
                            element={
                              <ProtectedRoute allowedRoles={['trainer', 'coach']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">Training Sessions</h1>
                                  <p className="text-gray-600 mt-2">Plan and manage training sessions</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Training sessions interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />

                          {/* Parent Routes */}
                          <Route 
                            path="/my-children" 
                            element={
                              <ProtectedRoute allowedRoles={['parent']}>
                                <div className="p-6">
                                  <h1 className="text-2xl font-bold">My Children</h1>
                                  <p className="text-gray-600 mt-2">Your children's information and progress</p>
                                  <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                    <p className="text-center text-gray-500">Children management interface will be implemented here</p>
                                  </div>
                                </div>
                              </ProtectedRoute>
                            } 
                          />

                          {/* Catch all - 404 */}
                          <Route 
                            path="*" 
                            element={
                              <div className="p-6 text-center">
                                <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
                                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                                <button 
                                  onClick={() => window.location.hash = '/dashboard'}
                                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  Go to Dashboard
                                </button>
                              </div>
                            } 
                          />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
              </Routes>

              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </Router>
        </AppProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;