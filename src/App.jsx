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

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-based Dashboard Router
const DashboardRouter = () => {
  const { user } = useAuth();

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="App min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

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
                          <Route path="/payments" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'parent']}><Payments /></ProtectedRoute>} />
                          <Route path="/store" element={<Store />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/messages" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'coach', 'parent', 'player']}><Messages /></ProtectedRoute>} />
                          <Route path="/profile" element={<Profile />} />

                          {/* Admin Only Routes */}
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