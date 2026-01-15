import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { MessageCircleIcon, X } from 'lucide-react'
import moment from 'moment'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const RecentMessages = ({ mobile }) => {
  const [messages, setMessages] = useState([])
  const [open, setOpen] = useState(false)
  const { user } = useUser()
  const { getToken } = useAuth()

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/user/recent-messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        const grouped = data.messages.reduce((acc, msg) => {
          const id = msg.from_user_id?._id
          if (!id) return acc
          if (!acc[id] || new Date(msg.createdAt) > new Date(acc[id].createdAt)) acc[id] = msg
          return acc
        }, {})
        setMessages(Object.values(grouped).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => {
    if (!user) return
    fetchRecentMessages()
    const interval = setInterval(fetchRecentMessages, 30000)
    return () => clearInterval(interval)
  }, [user])

  // ------------------ Desktop ------------------
  if (!mobile) {
    return (
      <div className="hidden lg:flex flex-col gap-4">
        {/* Sponsored */}
        <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-lg border border-white/60">
          <h3 className="font-semibold text-sm text-indigo-800 mb-2">Sponsored</h3>
          <img src={assets.sponsored_img} alt="Sponsored" className="w-full h-32 object-cover rounded-lg shadow-md" />
          <p className="text-xs text-purple-700 mt-1 font-medium">Email marketing</p>
          <p className="text-[10px] text-gray-500 mt-1">Supercharge your marketing with a powerful easy-to-use platform.</p>
        </div>

        {/* Recent Messages */}
        <div className="rounded-xl p-3 bg-gradient-to-br from-white via-indigo-50 to-purple-50 shadow-lg border border-white/60 flex flex-col gap-2 max-h-[500px] overflow-y-auto no-scrollbar">
          <h3 className="font-semibold text-sm text-indigo-800 mb-2">Recent Messages</h3>
          {messages.map((m, i) => {
            const sender = m.from_user_id ?? {}
            return (
              <Link
                key={m._id ?? i}
                to={`/messages/${sender._id ?? ''}`}
                className="flex gap-2 p-2 rounded-xl bg-white/70 hover:bg-white shadow-md hover:shadow-purple-200 transition transform hover:-translate-y-0.5"
              >
                <img
                  src={sender.profile_picture ?? ''}
                  alt=""
                  className="w-8 h-8 rounded-full ring-2 ring-purple-400 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-semibold truncate text-indigo-900">{sender.full_name ?? 'Unknown'}</span>
                    <span className="text-[9px] text-gray-500">{moment(m.createdAt).fromNow()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="truncate text-gray-700">{m.text ?? 'Media'}</span>
                    {!m.seen && (
                      <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md" />
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

  // ------------------ Mobile ------------------
  return (
    <> 
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden fixed bottom-30 right-3 z-50 p-3 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl hover:shadow-pink-400 transition transform hover:-translate-y-1 "
        >
          <MessageCircleIcon size={20} className="text-white" />
        </button>
      )}

      {open && (
        <>
          <div onClick={() => setOpen(false)} className="sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
          <aside className="sm:hidden fixed top-0 right-0 z-50 h-full w-full max-w-[260px] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl overflow-y-auto">
            <div className="flex flex-col gap-3 p-3 relative">
              <button onClick={() => setOpen(false)} className="absolute top-3 left-3 p-2 rounded-full bg-white shadow hover:bg-gray-100">
                <X size={16} />
              </button>

              {/* Sponsored */}
              <div className="rounded-xl p-3 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-md border border-white/50">
                <h3 className="font-semibold text-sm text-indigo-800 mb-2"></h3>
                <img src={assets.sponsored_img} alt="Sponsored" className="w-full h-32 object-cover rounded-lg shadow-md" />
                <p className="text-xs text-purple-700 mt-1 font-medium">Email marketing</p>
                <p className="text-[10px] text-gray-500 mt-1">Supercharge your marketing with a powerful easy-to-use platform.</p>
              </div>

              {/* Recent Messages */}
              <div className="flex flex-col gap-2">
                {messages.map((m, i) => {
                  const sender = m.from_user_id ?? {}
                  return (
                    <Link
                      key={m._id ?? i}
                      to={`/messages/${sender._id ?? ''}`}
                      className="flex gap-2 p-2 rounded-xl bg-white/70 hover:bg-white shadow-md hover:shadow-purple-200 transition transform hover:-translate-y-0.5"
                    >
                      <img
                        src={sender.profile_picture ?? ''}
                        alt=""
                        className="w-8 h-8 rounded-full ring-2 ring-purple-400 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="font-semibold truncate text-indigo-900">{sender.full_name ?? 'Unknown'}</span>
                          <span className="text-[9px] text-gray-500">{moment(m.createdAt).fromNow()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="truncate text-gray-700">{m.text ?? 'Media'}</span>
                          {!m.seen && (
                            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-md" />
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

export default RecentMessages
