import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Messages = () => {
  const { connections } = useSelector((state) => state.connections)
  const navigate = useNavigate()

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
      "
    >
      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Messages
          </h1>
          <p className="text-slate-600">
            Talk to your friends and family
          </p>
        </div>

        {/* Connected Users */}
        <div className="flex flex-col gap-5">
          {connections.map((user) => (
            <div
              key={user._id}
              className="
                max-w-xl
                flex items-center gap-5 p-5
                rounded-xl
                bg-white/70 backdrop-blur
                border border-white/40
                shadow-lg
                hover:shadow-xl
                hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              {/* Avatar */}
              <img
                src={user.profile_picture}
                alt=""
                className="
                  rounded-full w-12 h-12 object-cover
                  ring-2 ring-indigo-200
                "
              />

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  {user.full_name}
                </p>
                <p className="text-indigo-500 text-sm">
                  @{user.username}
                </p>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {user.bio}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="
                    p-2 rounded-lg
                    bg-gradient-to-r from-indigo-500 to-purple-600
                    text-white
                    shadow
                    hover:from-indigo-600 hover:to-purple-700
                    hover:scale-105
                    active:scale-95
                    transition
                  "
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="
                    p-2 rounded-lg
                    bg-slate-100
                    text-slate-600
                    hover:bg-slate-200
                    hover:scale-105
                    active:scale-95
                    transition
                  "
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
