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
                        
                        {/* Placeholder routes */}
                        <Route path="/calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendar - Coming Soon</h1></div>} />
                        <Route path="/messages" element={<div className="p-6"><h1 className="text-2xl font-bold">Messages - Coming Soon</h1></div>} />
                        <Route path="/profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile - Coming Soon</h1></div>} />
                        <Route path="/players" element={<div className="p-6"><h1 className="text-2xl font-bold">Players Management - Coming Soon</h1></div>} />
                        <Route path="/teams" element={<div className="p-6"><h1 className="text-2xl font-bold">Teams Management - Coming Soon</h1></div>} />
                        <Route path="/invoices" element={<div className="p-6"><h1 className="text-2xl font-bold">Invoice Management - Coming Soon</h1></div>} />
                        <Route path="/payments" element={<div className="p-6"><h1 className="text-2xl font-bold">Payment Management - Coming Soon</h1></div>} />
                        <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports - Coming Soon</h1></div>} />
                        <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>} />
                        <Route path="/my-teams" element={<div className="p-6"><h1 className="text-2xl font-bold">My Teams - Coming Soon</h1></div>} />
                        <Route path="/attendance" element={<div className="p-6"><h1 className="text-2xl font-bold">Attendance - Coming Soon</h1></div>} />
                        <Route path="/training-sessions" element={<div className="p-6"><h1 className="text-2xl font-bold">Training Sessions - Coming Soon</h1></div>} />
                        <Route path="/my-children" element={<div className="p-6"><h1 className="text-2xl font-bold">My Children - Coming Soon</h1></div>} />
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