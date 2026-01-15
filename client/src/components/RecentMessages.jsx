import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { useAuth, useUser } from '@clerk/clerk-react'
import { MessageCircleIcon, X } from 'lucide-react'
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
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        const grouped = data.messages.reduce((acc, msg) => {
          const id = msg.from_user_id?._id
          if (!id) return acc
          if (!acc[id] || new Date(msg.createdAt) > new Date(acc[id].createdAt)) {
            acc[id] = msg
          }
          return acc
        }, {})

        setMessages(
          Object.values(grouped).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        )
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

  /* ================= DESKTOP ================= */
  if (!mobile) {
    return (
      <div className="hidden lg:flex flex-col w-80 shrink-0 sticky top-0 space-y-6">

        {/* Sponsored */}
        <div className="rounded-2xl p-4
                        bg-gradient-to-br from-white via-indigo-50 to-purple-100
                        shadow-xl shadow-indigo-300/30
                        border border-white/50">
          <h3 className="font-semibold text-slate-800 mb-2">
            Sponsored
          </h3>
          <img
            src={assets.sponsored_img}
            className="w-full h-40 rounded-xl object-cover shadow-md"
            alt="Sponsored"
          />
          <p className="mt-2 font-medium text-slate-700">
            Email marketing
          </p>
          <p className="text-sm text-slate-500">
            Supercharge your marketing with a powerful easy-to-use platform built for results.
          </p>
        </div>

        {/* Recent Messages */}
        <div className="rounded-2xl p-4
                        bg-gradient-to-br from-white via-purple-50 to-pink-100
                        shadow-xl shadow-purple-300/30
                        border border-white/50
                        flex flex-col gap-3">
          <h3 className="font-semibold text-slate-800">
            Recent Messages
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
            {messages.map((m, i) => {
              const sender = m.from_user_id ?? {}
              return (
                <Link
                  key={m._id ?? i}
                  to={`/messages/${sender._id ?? ''}`}
                  className="group flex gap-3 p-2.5 rounded-xl
                             bg-white/60 backdrop-blur
                             hover:bg-white
                             shadow-sm hover:shadow-md
                             transition-all active:scale-[0.98]"
                >
                  <img
                    src={sender.profile_picture ?? ''}
                    alt=""
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-400/30"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs gap-2">
                      <span className="font-semibold truncate text-slate-800">
                        {sender.full_name ?? 'Unknown'}
                      </span>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {moment(m.createdAt).fromNow()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[11px] text-slate-600 truncate">
                        {m.text ?? 'Media'}
                      </span>
                      {!m.seen && (
                        <span className="w-2.5 h-2.5 rounded-full
                                         bg-gradient-to-tr from-indigo-500 to-pink-500
                                         shadow-md shadow-pink-400/50" />
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ================= MOBILE ================= */
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden fixed bottom-4 right-4 z-50
                     p-4 rounded-full text-white
                     bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500
                     shadow-2xl shadow-purple-500/50
                     ring-2 ring-white/30
                     active:scale-95 transition"
        >
          <MessageCircleIcon size={20} />
        </button>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="sm:hidden fixed inset-0 z-40
                     bg-black/50 backdrop-blur-sm"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 z-50
          h-full w-[260px]
          bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600
          transform transition-all duration-300 ease-out
          ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="h-full p-3
                        bg-white/90 backdrop-blur-xl
                        flex flex-col gap-4 relative">

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="sm:hidden absolute top-3 left-3
                       p-2 rounded-full
                       bg-white/60 hover:bg-white
                       transition"
          >
            <X size={18} className="text-slate-700" />
          </button>

          {/* Sponsored */}
          <div className="rounded-xl p-3
                          bg-gradient-to-br from-white via-indigo-50 to-purple-100
                          shadow-md">
            <h3 className="font-semibold text-slate-800">
              Sponsored
            </h3>
            <img
              src={assets.sponsored_img}
              className="w-full h-36 rounded-lg object-cover mt-2"
              alt="Sponsored"
            />
            <p className="mt-2 text-slate-700 font-medium">
              Email marketing
            </p>
            <p className="text-sm text-slate-500">
              Supercharge your marketing with a powerful easy-to-use platform built for results.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {messages.map((m, i) => {
              const sender = m.from_user_id ?? {}
              return (
                <Link
                  key={m._id ?? i}
                  to={`/messages/${sender._id ?? ''}`}
                  className="flex gap-3 p-2.5 rounded-xl
                             bg-white/70 hover:bg-white
                             shadow-sm hover:shadow-md
                             transition active:scale-[0.98]"
                >
                  <img
                    src={sender.profile_picture ?? ''}
                    alt=""
                    className="w-8 h-8 rounded-full ring-2 ring-indigo-400/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs gap-2">
                      <span className="font-semibold truncate text-slate-800">
                        {sender.full_name ?? 'Unknown'}
                      </span>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {moment(m.createdAt).fromNow()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[11px] text-slate-600 truncate">
                        {m.text ?? 'Media'}
                      </span>
                      {!m.seen && (
                        <span className="w-2.5 h-2.5 rounded-full
                                         bg-gradient-to-tr from-indigo-500 to-pink-500" />
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
  )
}

export default RecentMessages
