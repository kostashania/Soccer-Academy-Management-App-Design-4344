import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiMenu, FiX, FiLogOut } from 'react-icons/fi'

// Mock Authentication Context
const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = (email, role) => {
    setLoading(true)
    setTimeout(() => {
      setUser({ email, role, name: `Demo ${role}` })
      setLoading(false)
    }, 1000)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Components
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  
  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Players', icon: FiUsers, path: '/players' },
    { name: 'Calendar', icon: FiCalendar, path: '/calendar' },
    { name: 'Payments', icon: FiDollarSign, path: '/payments' }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none
      `}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Sports Academy</h2>
            <button onClick={onClose} className="lg:hidden">
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 mb-2"
              onClick={(e) => {
                e.preventDefault()
                onClose?.()
              }}
            >
              <item.icon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{item.name}</span>
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <FiLogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

const Header = ({ onMenuClick }) => {
  const { user } = useAuth()
  
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
        </div>
      </div>
    </header>
  )
}

const Dashboard = () => {
  const { user } = useAuth()
  
  const stats = [
    { name: 'Total Players', value: '156', color: 'blue' },
    { name: 'Active Teams', value: '12', color: 'green' },
    { name: 'This Month Revenue', value: '€8,450', color: 'purple' },
    { name: 'Upcoming Events', value: '8', color: 'orange' }
  ]

  const roleSpecificContent = {
    'Super Admin': (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900">Super Admin Access</h3>
        <p className="text-purple-700 text-sm mt-1">
          You have full system access and can manage all users and settings.
        </p>
      </div>
    ),
    'Admin': (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900">Admin Dashboard</h3>
        <p className="text-blue-700 text-sm mt-1">
          Manage players, teams, payments and view comprehensive reports.
        </p>
      </div>
    ),
    'Trainer': (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900">Trainer Dashboard</h3>
        <p className="text-green-700 text-sm mt-1">
          Track attendance, manage training sessions and monitor player progress.
        </p>
      </div>
    ),
    'Parent': (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900">Parent Dashboard</h3>
        <p className="text-orange-700 text-sm mt-1">
          View your children's progress, payments, and upcoming events.
        </p>
      </div>
    ),
    'Player': (
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <h3 className="font-semibold text-cyan-900">Player Dashboard</h3>
        <p className="text-cyan-700 text-sm mt-1">
          Check your schedule, team updates and personal performance stats.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                <FiUsers className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {roleSpecificContent[user?.name] || (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900">Welcome!</h3>
          <p className="text-gray-700 text-sm mt-1">
            Your role-specific dashboard content will appear here.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              'New player John Doe registered',
              'Payment received from Sarah Smith',
              'Training session scheduled for Saturday',
              'Team Lions won the championship!'
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              { title: 'Team Training', date: 'Today 4:00 PM' },
              { title: 'Match vs Eagles', date: 'Saturday 10:00 AM' },
              { title: 'Parent Meeting', date: 'Sunday 2:00 PM' }
            ].map((event, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const LoginPage = () => {
  const { login, loading } = useAuth()
  
  const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@academy.com', name: 'Demo Super Admin' },
    { role: 'Admin', email: 'admin@academy.com', name: 'Demo Admin' },
    { role: 'Trainer', email: 'trainer@academy.com', name: 'Demo Trainer' },
    { role: 'Parent', email: 'parent@academy.com', name: 'Demo Parent' },
    { role: 'Player', email: 'player@academy.com', name: 'Demo Player' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sports Academy Management
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Demo Platform - Choose a role to explore
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-3">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                onClick={() => login(account.email, account.role)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{account.role}</span>
                <span className="text-sm text-gray-500">{account.email}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6">
            <p className="text-xs text-gray-500 text-center">
              Click any role above to instantly login and explore the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/players" element={<Dashboard />} />
                    <Route path="/calendar" element={<Dashboard />} />
                    <Route path="/payments" element={<Dashboard />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App