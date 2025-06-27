import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';

// Components
import Layout from './components/Layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard/Dashboard';

// Pages by Role
import AdminDashboard from './pages/admin/AdminDashboard';
import CoachDashboard from './pages/coach/CoachDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import PlayerDashboard from './pages/player/PlayerDashboard';
import SponsorDashboard from './pages/sponsor/SponsorDashboard';

// Shared Pages
import Calendar from './pages/Calendar/Calendar';
import Payments from './pages/Payments/Payments';
import Store from './pages/Store/Store';
import Cart from './pages/Cart/Cart';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('Role not allowed:', user?.role, 'Allowed:', allowedRoles);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log('Rendering dashboard for role:', user?.role);

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
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

// Auth Guard Component
const AuthGuard = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
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
                <Route 
                  path="/signup" 
                  element={
                    <AuthGuard>
                      <SignupPage />
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
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<DashboardRouter />} />
                          <Route path="/calendar" element={<Calendar />} />
                          <Route
                            path="/payments"
                            element={
                              <ProtectedRoute allowedRoles={['admin', 'manager', 'parent']}>
                                <Payments />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/store" element={<Store />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route
                            path="/messages"
                            element={
                              <ProtectedRoute allowedRoles={['admin', 'manager', 'coach', 'parent', 'player']}>
                                <Messages />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/profile" element={<Profile />} />

                          {/* Admin Only Routes - Fixed with /* */}
                          <Route
                            path="/admin/*"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                              </ProtectedRoute>
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
                autoClose={5000}
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
    </ThemeProvider>
  );
}

export default App;