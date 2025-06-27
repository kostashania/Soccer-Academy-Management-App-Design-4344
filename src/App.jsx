import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import Layout from './components/Layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import Calendar from './pages/Calendar/Calendar';
import Payments from './pages/Payments/Payments';
import Store from './pages/Store/Store';
import Cart from './pages/Cart/Cart';
import Messages from './pages/Messages/Messages';
import Profile from './pages/Profile/Profile';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
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

function App() {
  return (
    <AuthProvider>
      <DataProvider>
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
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route
                          path="/payments"
                          element={
                            <ProtectedRoute allowedRoles={['admin', 'parent']}>
                              <Payments />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/store" element={<Store />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/profile" element={<Profile />} />
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
      </DataProvider>
    </AuthProvider>
  );
}

export default App;