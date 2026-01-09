import React, { useEffect, useRef, useState } from 'react'
import { dummyMessagesData, dummyUserData } from '../assets/assets'
import { ImageIcon, SendHorizonal } from 'lucide-react'

const ChatBox = () => {
  const messages = dummyMessagesData
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user] = useState(dummyUserData)
  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    setText('')
    setImage(null)
  }

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
            <p className="font-medium text-slate-800">
              {user.full_name}
            </p>
            <p className="text-sm text-gray-500">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted(
                (a, b) =>
                  new Date(a.createdAt) - new Date(b.createdAt)
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
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default ChatBox
