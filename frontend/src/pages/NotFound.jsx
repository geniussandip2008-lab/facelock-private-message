import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full">
        <div className="text-6xl mb-6">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound