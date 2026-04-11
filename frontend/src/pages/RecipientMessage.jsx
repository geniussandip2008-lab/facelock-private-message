import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

const RecipientMessage = () => {
  const { link } = useParams()

  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    loadMessage()
  }, [link])

  const loadMessage = async () => {
    try {
      const data = await api.getMessageByLink(link)
      setMessage(data)
    } catch (err) {
      setError(err.message || 'Invalid or expired link')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = () => {
    setTimeout(() => {
      setUnlocked(true)
    }, 1500)
  }

  const handleReply = async () => {
    try {
      await api.sendReply(link, { reply_text: replyText })
      alert('Reply sent!')
      setReplyText('')
    } catch (err) {
      alert('Failed to send reply')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading message...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <a href="/" className="text-blue-600 underline">Go Home</a>
        </div>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Secure Message</h2>
          <p className="mb-6">Face verification required to unlock</p>
          <button
            onClick={handleUnlock}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Verify & Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-4">
          {message.recipient_label || 'Private Message'}
        </h2>

        <p className="text-lg text-gray-700 mb-6 whitespace-pre-line">
          {message.message_text}
        </p>

        {message.reply_allowed && (
          <div className="mt-8">
            <textarea
              rows="4"
              className="w-full border rounded-xl p-3 mb-4"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={handleReply}
              className="bg-green-600 text-white px-6 py-2 rounded-xl"
            >
              Send Reply
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipientMessage