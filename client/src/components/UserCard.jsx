import React from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'

const UserCard = ({ user }) => {
  const currentUser = dummyUserData

  const handleFollow = async () => {}
  const handleConnectionRequest = async () => {}

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition">
      
      {/* User Info */}
      <img
        src={user.profile_picture}
        alt=""
        className="w-20 h-20 rounded-full object-cover"
      />

      <p className="mt-4 font-semibold text-slate-800">
        {user.full_name}
      </p>

      {user.username && (
        <p className="text-gray-500 text-sm">@{user.username}</p>
      )}

      {user.bio && (
        <p className="text-gray-600 mt-2 text-sm px-2">
          {user.bio}
        </p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between w-full mt-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{user.location}</span>
        </div>

        <div>
          <span className="font-medium text-slate-700">
            {user.followers.length}
          </span>{' '}
          Followers
        </div>
      </div>

      {/* Actions */}
      <div className="flex mt-4 gap-2 w-full">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition
            ${
              currentUser?.following.includes(user._id)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
        >
          <UserPlus className="w-4 h-4" />
          {currentUser?.following.includes(user._id)
            ? 'Following'
            : 'Follow'}
        </button>

        {/* Connection / Message Button */}
        <button
          onClick={handleConnectionRequest}
          className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-slate-100 transition group"
        >
          {currentUser?.connections.includes(user._id) ? (
            <MessageCircle className="w-5 h-5 group-hover:scale-105 transition" />
          ) : (
            <Plus className="w-5 h-5 group-hover:scale-105 transition" />
          )}
        </button>
      </div>
    </div>
  )
}

export default UserCard
