import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Users,
  UserPlus,
  UserRoundPen,
  MessageSquare
} from 'lucide-react'

import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { fetchConnections } from '../features/connections/connectionsSlice'
import api from '../api/axios'

const Connections = () => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()
  const [currentTab, setCurrentTab] = useState('Followers')
  const navigate = useNavigate()

  const {
    connections,
    pendingConnections,
    followers,
    following
  } = useSelector((state) => state.connections)

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserPlus },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: Users },
  ]

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token))
    })
  }, [])

  const activeData =
    dataArray.find((item) => item.label === currentTab)?.value || []

  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/user/unfollow',
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        dispatch(fetchConnections(token))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const acceptConnection = async (userId) => {
    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/user/accept',
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        dispatch(fetchConnections(token))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen
                    bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         bg-clip-text text-transparent">
            Connections
          </h1>
          <p className="text-slate-600 mt-1">
            Manage your network and discover new connections
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 flex-wrap mb-8">
          {dataArray.map((tab) => {
            const active = currentTab === tab.label
            return (
              <button
                key={tab.label}
                onClick={() => setCurrentTab(tab.label)}
                className={`
                  flex items-center gap-2 px-5 py-2 rounded-full text-sm
                  transition-all duration-300
                  ${active
                    ? 'bg-white shadow-lg text-indigo-600 scale-[1.03]'
                    : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeData.map((user) => (
            <div
              key={user._id}
              className="
                bg-white/80 backdrop-blur-xl
                rounded-2xl p-5
                shadow-md hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <img
                  src={user.profile_picture}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover
                             ring-2 ring-indigo-500/30"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {user.full_name}
                  </p>
                  <p className="text-slate-500 text-sm">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                {user.bio.slice(0, 30)}...
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-5">
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="
                    px-3 py-1.5 text-sm rounded-full
                    bg-slate-100 hover:bg-slate-200
                    transition
                  "
                >
                  View Profile
                </button>

                {currentTab === 'Following' && (
                  <button
                    onClick={() => handleUnfollow(user._id)}
                    className="
                      px-3 py-1.5 text-sm rounded-full
                      bg-red-100 text-red-600
                      hover:bg-red-200 transition
                    "
                  >
                    Unfollow
                  </button>
                )}

                {currentTab === 'Pending' && (
                  <button
                    onClick={() => acceptConnection(user._id)}
                    className="
                      px-3 py-1.5 text-sm rounded-full
                      bg-green-100 text-green-600
                      hover:bg-green-200 transition
                    "
                  >
                    Accept
                  </button>
                )}

                {currentTab === 'Connections' && (
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className="
                      flex items-center gap-1 px-3 py-1.5 text-sm rounded-full
                      bg-gradient-to-r from-indigo-500 to-purple-500
                      text-white hover:brightness-110 transition
                    "
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Connections
