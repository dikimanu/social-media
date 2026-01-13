import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const RecentMessages = () => {
  const [messages, setMessages] = useState([])
  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/user/recent-messages', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        // Group messages by sender and get latest message per sender
        const groupedMessages = data.messages.reduce((acc, message) => {
          const senderId = message.from_user_id?._id
          if (!senderId) return acc

          if (
            !acc[senderId] ||
            new Date(message.createdAt) > new Date(acc[senderId]?.createdAt)
          ) {
            acc[senderId] = message
          }
          return acc
        }, {})

        // Sort messages by date (latest first)
        const sortedMessages = Object.values(groupedMessages).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setMessages(sortedMessages)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRecentMessages()
      const intervalId = setInterval(fetchRecentMessages, 30000) // refresh every 30s
      return () => clearInterval(intervalId)
    }
  }, [user])

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-slate-800 font-semibold mb-3">Recent Messages</h3>

      <div className="space-y-3">
        {messages.map((message, index) => {
          const sender = message.from_user_id ?? {}
          return (
            <Link
              to={`/messages/${sender._id ?? ''}`}
              key={message._id ?? index}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 transition"
            >
              <img
                src={sender.profile_picture ?? ''}
                alt={sender.full_name ?? 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm truncate">
                    {sender.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {message.createdAt
                      ? moment(message.createdAt).fromNow()
                      : ''}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">
                    {message.text ?? 'Media'}
                  </p>

                  {!message.seen && (
                    <span className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                      •
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RecentMessages
