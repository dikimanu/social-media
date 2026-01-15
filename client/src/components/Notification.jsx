import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Notification = ({ t, message }) => {
  const navigate = useNavigate()

  if (!message?.from_user_id) return null

  return (
    <div
      className="
        max-w-md w-full
        bg-gradient-to-br from-white via-indigo-50 to-purple-50
        border border-white/60
        backdrop-blur-xl
        shadow-xl
        rounded-2xl
        flex
        transition-all duration-300
        hover:scale-[1.03]
        hover:shadow-2xl
      "
    >
      {/* Content */}
      <div className="flex-1 p-4">
        <div className="flex items-start gap-3">
          <img
            src={message.from_user_id.profile_picture || ''}
            alt={message.from_user_id.full_name || ''}
            className="
              h-10 w-10 rounded-full
              object-cover
              ring-2 ring-indigo-500/30
            "
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">
              {message.from_user_id.full_name || 'Unknown'}
            </p>

            <p className="text-sm text-slate-600 leading-snug">
              {message.text?.slice(0, 50) || 'No message'}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center border-l border-indigo-100">
        <button
          onClick={() => {
            navigate(`/messages/${message.from_user_id._id}`)
            toast.dismiss(t.id)
          }}
          className="
            px-5 py-4
            font-semibold text-sm
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            text-white
            rounded-r-2xl
            transition-all duration-300
            hover:brightness-110
            active:scale-95
          "
        >
          Reply
        </button>
      </div>
    </div>
  )
}

export default Notification
