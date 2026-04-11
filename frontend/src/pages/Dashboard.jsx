import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent mb-6">
          Welcome Back
        </h1>
        <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
          {(user && (user.display_name || user.username)) || 'User'}, ready to send secure messages?
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to="/create-message"
                className="group bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-2xl p-8 hover:shadow-2xl transition-all"
              >
                <div className="text-4xl mb-4">✉️</div>
                <h4 className="text-2xl font-bold mb-2">Create Message</h4>
                <p className="text-white/90">Send a secure private message</p>
              </Link>

              <Link
                to="/messages"
                className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all"
              >
                <div className="text-4xl mb-4">📨</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">My Messages</h4>
                <p className="text-gray-600">View sent messages and replies</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile / Info */}
        <div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-semibold text-gray-900">{(user && user.username) || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Display Name</p>
                <p className="text-lg font-semibold text-gray-900">{(user && user.display_name) || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{(user && user.role) || 'creator'}</p>
              </div>
            </div>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="block mt-8 text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition"
              >
                Open Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard