import { useState, useEffect } from 'react'
import api from '../services/api'

const MessageHistory = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const data = await api.getMessages()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter((message) => {
    const recipient = (message.recipient_label || '').toLowerCase()
    const text = (message.message_text || '').toLowerCase()
    const q = search.toLowerCase()
    return recipient.includes(q) || text.includes(q)
  })

  const copyLink = (uniqueLink) => {
    const fullLink = `${window.location.origin}/message/${uniqueLink}`
    navigator.clipboard.writeText(fullLink)
    alert('Link copied!')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Messages</h1>
        <p className="text-xl text-gray-600">View all your sent messages and their status</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl mb-8">
        <div className="p-6">
          <input
            type="text"
            placeholder="Search messages by recipient name..."
            className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No messages yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first secure private message and track its status here.
          </p>
          <a
            href="/create-message"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-semibold inline-block"
          >
            Create First Message
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-2xl shadow-xl group hover:shadow-2xl transition-all border-l-4 border-blue-500"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                    {message.recipient_label || 'Private Message'}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {message.message_text}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span>🎨 {message.message_type || 'text'}</span>
                    <span>📂 {message.category || 'personal'}</span>
                    <span>👀 {message.views_used || 0}/{message.view_limit || '∞'}</span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        message.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.status || 'unknown'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 {formatDate(message.created_at)}</span>
                    {message.first_opened_at && (
                      <span>✅ Opened {formatDate(message.first_opened_at)}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                  <button
                    onClick={() => copyLink(message.unique_link)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-medium"
                  >
                    Copy Link
                  </button>

                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageHistory