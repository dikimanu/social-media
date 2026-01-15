import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, SendHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import {
  addMessages,
  resetMessages,
  fetchMessages
} from '../features/messages/messagesSlice'

const ChatBox = () => {
  const { messages } = useSelector((state) => state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)

  const messagesEndRef = useRef(null)
  const connections = useSelector((state) => state.connections.connections)

  const fetchUserMessages = async () => {
    try {
      const token = await getToken()
      dispatch(fetchMessages({ token, userId }))
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendMessage = async () => {
    try {
      if (!text && !image) return

      const token = await getToken()
      const formData = new FormData()
      formData.append('to_user_id', userId)
      formData.append('text', text)
      if (image) formData.append('image', image)

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setText('')
        setImage(null)
        dispatch(addMessages(data.message))
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (connections.length > 0) {
      const foundUser = connections.find(
        (connection) => connection._id === userId
      )
      setUser(foundUser)
    }
  }, [connections, userId])

  useEffect(() => {
    fetchUserMessages()
    return () => {
      dispatch(resetMessages())
    }
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    user && (
      <div className="flex flex-col h-screen
                      bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4
                        bg-white/80 backdrop-blur-xl
                        border-b border-white/60 shadow-sm">
          <img
            src={user.profile_picture}
            alt=""
            className="w-11 h-11 rounded-full object-cover
                       ring-2 ring-indigo-500/30"
          />
          <div>
            <p className="font-semibold text-slate-800">
              {user.full_name}
            </p>
            <p className="text-xs text-slate-500">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isMe = message.to_user_id === user._id

                return (
                  <div
                    key={index}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-sm p-3 text-sm shadow-md
                        rounded-2xl
                        ${isMe
                          ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-br-md'
                          : 'bg-white/90 backdrop-blur text-slate-700 rounded-bl-md'}
                      `}
                    >
                      {message.message_type === 'image' && (
                        <img
                          src={message.media_url}
                          alt=""
                          className="rounded-xl mb-2 max-h-64 object-cover"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                    </div>
                  </div>
                )
              })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3
                        bg-white/90 backdrop-blur-xl
                        border-t border-white/60">
          <div className="flex items-center gap-3
                          bg-slate-100/70 rounded-full
                          px-4 py-2 shadow-inner">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none
                         text-sm text-slate-700"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />

            <label htmlFor="image" className="cursor-pointer">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition" />
              )}
            </label>

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <button
              onClick={sendMessage}
              className="
                p-2 rounded-full
                bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500
                text-white shadow-lg
                hover:brightness-110
                active:scale-95
                transition
              "
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatBox
