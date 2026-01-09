import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserPlus,
  UserRoundPen,
  MessageSquare
} from 'lucide-react'

import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets'

const Connections = () => {
  const [currentTab, setCurrentTab] = useState('Followers')
  const navigate = useNavigate()

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserPlus },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: Users },
  ]

  const activeData =
    dataArray.find((item) => item.label === currentTab)?.value || []

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connections
          </h1>
          <p className="text-slate-600">
            Manage your network and discover new connections
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {dataArray.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setCurrentTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition
                ${
                  currentTab === tab.label
                    ? 'bg-white shadow font-medium text-slate-900'
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Connections List */}
        <div className="flex flex-wrap gap-6">
          {activeData.map((user) => (
            <div
              key={user._id}
              className="w-full sm:w-[48%] lg:w-[31%] bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.profile_picture}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">
                    {user.full_name}
                  </p>
                  <p className="text-slate-500 text-sm">
                    @{user.username}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                {user.bio.slice(0, 30)}...
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="px-3 py-1 text-sm rounded-md bg-slate-100 hover:bg-slate-200"
                >
                  View Profile
                </button>

                {currentTab === 'Following' && (
                  <button className="px-3 py-1 text-sm rounded-md bg-red-50 text-red-600 hover:bg-red-100">
                    Unfollow
                  </button>
                )}

                {currentTab === 'Pending' && (
                  <button className="px-3 py-1 text-sm rounded-md bg-green-50 text-green-600 hover:bg-green-100">
                    Accept
                  </button>
                )}

                {currentTab === 'Connections' && (
                  <button
                    onClick={() => navigate(`/messages/${user._id}`)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
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
