import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent mb-8">
            FaceLock
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Secure private messages protected by face verification. 
            Only the right person can unlock your message.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            {!user ? (
              <>
                <Link to="/register" className="btn-primary text-xl py-4 px-8 w-full sm:w-auto">
                  Create Account
                </Link>
                <Link to="/login" className="btn-secondary text-xl py-4 px-8 w-full sm:w-auto">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn-primary text-xl py-4 px-8 w-full sm:w-auto">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Face Verification</h3>
            <p className="text-gray-600">Browser-based face recognition ensures only the intended recipient can read your message.</p>
          </div>
          
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Zero Knowledge</h3>
            <p className="text-gray-600">No servers store face data. Everything processed in recipient's browser.</p>
          </div>
          
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600">Instant verification with real-time liveness detection.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home