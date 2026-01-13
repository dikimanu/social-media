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
      <div className="flex flex-col h-screen bg-slate-50">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
          <img
            src={user.profile_picture}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-slate-800">{user.full_name}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
              )
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.to_user_id !== user._id
                      ? 'justify-start'
                      : 'justify-end'
                  }`}
                >
                  <div
                    className={`p-3 text-sm max-w-sm rounded-lg shadow bg-white text-slate-700 ${
                      message.to_user_id !== user._id
                        ? 'rounded-bl-none'
                        : 'rounded-br-none'
                    }`}
                  >
                    {message.message_type === 'image' && (
                      <img
                        src={message.media_url}
                        alt=""
                        className="w-full max-w-sm rounded-lg mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 outline-none text-sm text-slate-700"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />

            <label htmlFor="image" className="cursor-pointer">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-8 w-8 object-cover rounded"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
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
              className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
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
