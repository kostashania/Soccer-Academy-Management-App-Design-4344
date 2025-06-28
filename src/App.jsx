import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import AuthPage from './pages/auth/AuthPage'
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard'
import AdminDashboard from './pages/dashboards/AdminDashboard'

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { profile, isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/auth" replace />

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Auth Guard Component
const AuthGuard = ({ children }) => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) return <LoadingSpinner />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return children
}

// Dashboard Router Component
const DashboardRouter = () => {
  const { profile } = useAuth()

  switch (profile?.role) {
    case 'super_admin':
      return <SuperAdminDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'trainer':
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
          <p className="text-gray-600 mt-2">Trainer dashboard coming soon...</p>
        </div>
      )
    case 'parent':
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Parent Dashboard</h1>
          <p className="text-gray-600 mt-2">Parent dashboard coming soon...</p>
        </div>
      )
    case 'player':
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Player Dashboard</h1>
          <p className="text-gray-600 mt-2">Player dashboard coming soon...</p>
        </div>
      )
    case 'sponsor':
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Sponsor Dashboard</h1>
          <p className="text-gray-600 mt-2">Sponsor dashboard coming soon...</p>
        </div>
      )
    default:
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <p className="text-gray-600 mt-2">Please contact an administrator to set up your role.</p>
        </div>
      )
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/auth"
              element={
                <AuthGuard>
                  <AuthPage />
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

                      {/* Common Routes */}
                      <Route 
                        path="/calendar" 
                        element={
                          <div className="p-6">
                            <h1 className="text-2xl font-bold">Calendar</h1>
                            <p className="text-gray-600 mt-2">Calendar coming soon...</p>
                          </div>
                        } 
                      />
                      <Route 
                        path="/messages" 
                        element={
                          <div className="p-6">
                            <h1 className="text-2xl font-bold">Messages</h1>
                            <p className="text-gray-600 mt-2">Messages coming soon...</p>
                          </div>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <div className="p-6">
                            <h1 className="text-2xl font-bold">Profile</h1>
                            <p className="text-gray-600 mt-2">Profile management coming soon...</p>
                          </div>
                        } 
                      />

                      {/* Catch all - 404 */}
                      <Route
                        path="*"
                        element={
                          <div className="p-6 text-center">
                            <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
                            <p className="text-gray-600 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
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
    </AuthProvider>
  )
}

export default App