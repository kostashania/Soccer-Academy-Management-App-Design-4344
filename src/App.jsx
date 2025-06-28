import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';

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
      return <SuperAdminDashboard />;
    case 'trainer':
      return <TrainerDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <ParentDashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <Routes>
              <Route 
                path="/login" 
                element={
                  <AuthGuard>
                    <LoginPage />
                  </AuthGuard>
                } 
              />
              
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardRouter />} />
                        
                        {/* Admin Routes */}
                        <Route
                          path="/players"
                          element={
                            <ProtectedRoute allowedRoles={['admin']}>
                              <div>Players Management - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/invoices"
                          element={
                            <ProtectedRoute allowedRoles={['admin']}>
                              <div>Invoice Management - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports"
                          element={
                            <ProtectedRoute allowedRoles={['admin']}>
                              <div>Financial Reports - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />

                        {/* Trainer Routes */}
                        <Route
                          path="/my-teams"
                          element={
                            <ProtectedRoute allowedRoles={['trainer']}>
                              <div>My Teams - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/attendance"
                          element={
                            <ProtectedRoute allowedRoles={['trainer']}>
                              <div>Attendance Management - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />

                        {/* Parent Routes */}
                        <Route
                          path="/my-children"
                          element={
                            <ProtectedRoute allowedRoles={['parent']}>
                              <div>My Children - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/payments"
                          element={
                            <ProtectedRoute allowedRoles={['parent', 'admin']}>
                              <div>Payment History - Coming Soon</div>
                            </ProtectedRoute>
                          }
                        />

                        {/* Common Routes */}
                        <Route path="/calendar" element={<div>Calendar - Coming Soon</div>} />
                        <Route path="/messages" element={<div>Messages - Coming Soon</div>} />
                        <Route path="/profile" element={<div>Profile - Coming Soon</div>} />
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
    </AuthProvider>
  );
}

export default App;