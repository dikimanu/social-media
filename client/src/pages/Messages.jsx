import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Messages = () => {
  const { connections } = useSelector((state) => state.connections) // ✅ fixed
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Messages
          </h1>
          <p className="text-slate-600">
            Talk to your friends and family
          </p>
        </div>

        {/* Connected Users */}
        <div className="flex flex-col gap-4">
          {connections.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex items-center gap-5 p-5 bg-white shadow-sm rounded-lg hover:shadow-md transition"
            >
              <img
                src={user.profile_picture}
                alt=""
                className="rounded-full w-12 h-12 object-cover"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-800">
                  {user.full_name}
                </p>
                <p className="text-slate-500 text-sm">
                  @{user.username}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {user.bio}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="p-2 rounded-md hover:bg-indigo-50 text-indigo-600"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Messages
