import { useState, useEffect } from 'react'
import api from '../services/api'

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await api.getAdminAnalytics()
      setAnalytics(data.data || data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">Platform analytics and overview</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Creators</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.totalCreators || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Messages</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.totalMessages || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-sm text-gray-500 mb-2">Total Replies</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.totalReplies || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-sm text-gray-500 mb-2">Verification Logs</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.totalVerificationLogs || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-sm text-gray-500 mb-2">Active Messages</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.activeMessages || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-sm text-gray-500 mb-2">Suspicious Activity</h3>
          <p className="text-3xl font-bold text-red-600">{analytics?.suspiciousActivity || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard