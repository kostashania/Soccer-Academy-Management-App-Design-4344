import React from 'react'
import {HashRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' 

// Contexts
import {AuthProvider} from './contexts/AuthContext'
import {AppProvider} from './contexts/AppContext'
import {DataProvider} from './contexts/DataContext'
import {ThemeProvider} from './contexts/ThemeContext'
import {DatabaseProvider} from './contexts/DatabaseContext' 

// Components
import Layout from './components/Layout/Layout'
import MobileNav from './components/Layout/MobileNav' 

// Pages
import AuthPage from './pages/auth/AuthPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import Dashboard from './pages/Dashboard/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import CoachDashboard from './pages/coach/CoachDashboard'
import ParentDashboard from './pages/parent/ParentDashboard'
import PlayerDashboard from './pages/player/PlayerDashboard'
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import SponsorDashboard from './pages/sponsor/SponsorDashboard'
import Calendar from './pages/Calendar/Calendar'
import Messages from './pages/Messages/Messages'
import Payments from './pages/Payments/Payments'
import Profile from './pages/Profile/Profile'
import Store from './pages/Store/Store'
import Cart from './pages/Cart/Cart' 

// Platform Components
import PlatformPage from './pages/Platform/PlatformPage'
import PlatformManagement from './pages/Platform/PlatformManagement'

// Database Component  
import DatabaseInfo from './pages/Database/DatabaseInfo'

import {useAuth} from './contexts/AuthContext' 

// Protected Route Component 
const ProtectedRoute=({children})=> {
  const {isAuthenticated,loading}=useAuth() 

  if (loading) {
    return ( 
      <div className="min-h-screen flex items-center justify-center bg-gray-50"> 
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> 
      </div> 
    )
  }

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />
} 

// Role-based Dashboard Router 
const DashboardRouter=()=> {
  const {profile}=useAuth() 

  if (!profile) {
    return <Dashboard />
  }

  switch (profile.role) {
    case 'super_admin': 
      return <SuperAdminDashboard /> 
    case 'admin': 
      return <AdminDashboard /> 
    case 'trainer': 
    case 'coach': 
      return <CoachDashboard /> 
    case 'parent': 
      return <ParentDashboard /> 
    case 'player': 
      return <PlayerDashboard /> 
    case 'sponsor': 
      return <SponsorDashboard /> 
    default: 
      return <Dashboard />
  }
} 

// Main App Component 
function App() {
  return ( 
    <AuthProvider> 
      <DatabaseProvider> 
        <ThemeProvider> 
          <AppProvider> 
            <DataProvider> 
              <Router> 
                <div className="App"> 
                  <Routes> 
                    {/* Public Routes */} 
                    <Route path="/auth/login" element={<LoginPage />} /> 
                    <Route path="/auth/signup" element={<SignupPage />} /> 
                    <Route path="/auth/*" element={<AuthPage />} /> 

                    {/* Protected Routes */} 
                    <Route 
                      path="/*" 
                      element={
                        <ProtectedRoute> 
                          <Layout> 
                            <Routes> 
                              <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
                              <Route path="/dashboard" element={<DashboardRouter />} /> 
                              <Route path="/admin/*" element={<AdminDashboard />} /> 
                              <Route path="/calendar" element={<Calendar />} /> 
                              <Route path="/messages" element={<Messages />} /> 
                              <Route path="/payments" element={<Payments />} /> 
                              <Route path="/profile" element={<Profile />} /> 
                              <Route path="/store" element={<Store />} /> 
                              <Route path="/cart" element={<Cart />} /> 

                              {/* Platform Routes */} 
                              <Route path="/platform" element={<PlatformPage />} /> 
                              <Route path="/platform-management" element={<PlatformManagement />} /> 

                              {/* Database Route */}
                              <Route path="/database" element={<DatabaseInfo />} />
                              
                              {/* Fallback route */}
                              <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Routes> 
                          </Layout> 
                          <MobileNav /> 
                        </ProtectedRoute>
                      } 
                    /> 
                  </Routes> 

                  {/* Toast Notifications */} 
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
                    theme="light" 
                    toastClassName="text-sm" 
                  /> 
                </div> 
              </Router> 
            </DataProvider> 
          </AppProvider> 
        </ThemeProvider> 
      </DatabaseProvider> 
    </AuthProvider> 
  )
}

export default App