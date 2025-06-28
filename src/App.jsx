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
      return <div className="p-6"><h1 className="text-2xl font-bold">Trainer Dashboard</h1><p className="text-gray-600 mt-2">Trainer dashboard coming soon...</p></div>
    case 'parent':
      return <div className="p-6"><h1 className="text-2xl font-bold">Parent Dashboard</h1><p className="text-gray-600 mt-2">Parent dashboard coming soon...</p></div>
    case 'player':
      return <div className="p-6"><h1 className="text-2xl font-bold">Player Dashboard</h1><p className="text-gray-600 mt-2">Player dashboard coming soon...</p></div>
    case 'sponsor':
      return <div className="p-6"><h1 className="text-2xl font-bold">Sponsor Dashboard</h1><p className="text-gray-600 mt-2">Sponsor dashboard coming soon...</p></div>
    default:
      return <div className="p-6"><h1 className="text-2xl font-bold">Welcome!</h1><p className="text-gray-600 mt-2">Please contact an administrator to set up your role.</p></div>
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
                      <Route path="/calendar" element={<div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p className="text-gray-600 mt-2">Calendar coming soon...</p></div>} />
                      <Route path="/messages" element={<div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p className="text-gray-600 mt-2">Messages coming soon...</p></div>} />
                      <Route path="/profile" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile</h1><p className="text-gray-600 mt-2">Profile management coming soon...</p></div>} />

                      {/* Admin Routes */}
                      <Route
                        path="/players"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Players Management</h1><p className="text-gray-600 mt-2">Players management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/teams"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Teams Management</h1><p className="text-gray-600 mt-2">Teams management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/invoices"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Invoice Management</h1><p className="text-gray-600 mt-2">Invoice management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/payments"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin', 'parent']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Payments</h1><p className="text-gray-600 mt-2">Payment management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Reports & Analytics</h1><p className="text-gray-600 mt-2">Reports coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/sponsors"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Sponsor Management</h1><p className="text-gray-600 mt-2">Sponsor management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/store"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin', 'parent']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Academy Store</h1><p className="text-gray-600 mt-2">Store coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">System Settings</h1><p className="text-gray-600 mt-2">Settings coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Trainer Routes */}
                      <Route
                        path="/my-teams"
                        element={
                          <ProtectedRoute allowedRoles={['trainer']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">My Teams</h1><p className="text-gray-600 mt-2">Team management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/attendance"
                        element={
                          <ProtectedRoute allowedRoles={['trainer']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Attendance Tracking</h1><p className="text-gray-600 mt-2">Attendance tracking coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/training-sessions"
                        element={
                          <ProtectedRoute allowedRoles={['trainer']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Training Sessions</h1><p className="text-gray-600 mt-2">Training sessions coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Parent Routes */}
                      <Route
                        path="/my-children"
                        element={
                          <ProtectedRoute allowedRoles={['parent']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">My Children</h1><p className="text-gray-600 mt-2">Children management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Player Routes */}
                      <Route
                        path="/my-team"
                        element={
                          <ProtectedRoute allowedRoles={['player']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">My Team</h1><p className="text-gray-600 mt-2">Team information coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/performance"
                        element={
                          <ProtectedRoute allowedRoles={['player']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">My Performance</h1><p className="text-gray-600 mt-2">Performance tracking coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />

                      {/* Sponsor Routes */}
                      <Route
                        path="/sponsorship"
                        element={
                          <ProtectedRoute allowedRoles={['sponsor']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Sponsorship Management</h1><p className="text-gray-600 mt-2">Sponsorship management coming soon...</p></div>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <ProtectedRoute allowedRoles={['sponsor']}>
                            <div className="p-6"><h1 className="text-2xl font-bold">Sponsor Analytics</h1><p className="text-gray-600 mt-2">Analytics coming soon...</p></div>
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
    </AuthProvider>
  )
}

export default App