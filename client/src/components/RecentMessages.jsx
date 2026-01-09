import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import { Link } from 'react-router-dom'
import moment from 'moment'

const RecentMessages = () => {
  const [messages, setMessages] = useState([])

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData)
  }

  useEffect(() => {
    fetchRecentMessages()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-slate-800 font-semibold mb-3">Recent Messages</h3>

      <div className="space-y-3">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={message._id ?? index}
            className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 transition"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm truncate">
                  {message.from_user_id.full_name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 truncate">
                  {message.text ? message.text : 'Media'}
                </p>

                {!message.seen && (
                  <span className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    •
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentMessages
