import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    localStorage.removeItem('token')
    logout()
  }

  return (
    <nav className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent">
                FaceLock
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/create-message"
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  location.pathname === '/create-message'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                New Message
              </Link>

              <Link
                to="/messages"
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  location.pathname === '/messages'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                Messages
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`}
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
