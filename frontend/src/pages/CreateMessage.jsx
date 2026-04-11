import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const CreateMessage = () => {
  const [formData, setFormData] = useState({
    recipient_label: '',
    message_text: '',
    message_type: 'neutral',
    category: 'personal',
    reply_allowed: false,
    sender_identity_visible: true,
    view_limit: 1,
    link_validity_type: '3_days',
    until_opened: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [messageLink, setMessageLink] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.createMessage(formData)
      setSuccess('Message created successfully!')
      setMessageLink(response.recipient_url)

      setFormData({
        recipient_label: '',
        message_text: '',
        message_type: 'neutral',
        category: 'personal',
        reply_allowed: false,
        sender_identity_visible: true,
        view_limit: 1,
        link_validity_type: '3_days',
        until_opened: false
      })
    } catch (err) {
      setError(err.message || 'Failed to create message')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(messageLink)
    setSuccess('Link copied to clipboard!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Private Message</h1>
        <p className="text-xl text-gray-600">Send a secure message protected by face verification</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-8 max-w-2xl mx-auto">
          <p>{success}</p>
          {messageLink && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <p className="text-sm font-medium mb-2">Share this link:</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={messageLink}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Recipient Name (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              value={formData.recipient_label}
              onChange={(e) => setFormData({ ...formData, recipient_label: e.target.value })}
              placeholder="Call them by name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Message Type</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              value={formData.message_type}
              onChange={(e) => setFormData({ ...formData, message_type: e.target.value })}
            >
              <option value="romantic">Romantic</option>
              <option value="official">Official</option>
              <option value="friend">Friend</option>
              <option value="emotional">Emotional</option>
              <option value="special">Special</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Your Private Message</label>
          <textarea
            rows="8"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-y"
            value={formData.message_text}
            onChange={(e) => setFormData({ ...formData, message_text: e.target.value })}
            placeholder="Write your message here..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Reply Allowed</label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.reply_allowed}
                onChange={(e) => setFormData({ ...formData, reply_allowed: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Allow recipient to reply</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Show Sender Name</label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.sender_identity_visible}
                onChange={(e) => setFormData({ ...formData, sender_identity_visible: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Show your name</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">View Limit</label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              value={formData.view_limit}
              onChange={(e) => setFormData({ ...formData, view_limit: parseInt(e.target.value) })}
            >
              <option value={1}>1 view</option>
              <option value={2}>2 views</option>
              <option value={3}>3 views</option>
              <option value={0}>Unlimited</option>
            </select>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formData.message_text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-xl font-semibold text-lg"
          >
            {loading ? 'Creating...' : 'Create & Generate Link'}
          </button>
        </div>
      </form>

      <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Step: Face Verification</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          After creating the message, upload 3 reference face photos (front, left, right)
          for the recipient to verify their identity.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="font-medium text-blue-900 mb-2">Photo Tips:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Good lighting, full face visible</li>
            <li>• No sunglasses, hats, or heavy makeup</li>
            <li>• Clear, non-blurry photos</li>
            <li>• Recent photos work best</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateMessage