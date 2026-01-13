import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { fetchUser } from '../features/user/userSlice'

const UserCard = ({ user }) => {
  const currentUser = useSelector((state) => state.user.value)
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isFollowing = (currentUser?.following || []).includes(user._id)
  const isConnected = (currentUser?.connections || []).includes(user._id)

  const handleFollow = async () => {
    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/user/follow',
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        dispatch(fetchUser(token))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleConnectionRequest = async () => {
    if (isConnected) return navigate('/messages/' + user._id)

    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/user/connect',
        { id: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition">
      <img
        src={user.profile_picture}
        alt=""
        className="w-20 h-20 rounded-full object-cover"
      />

      <p className="mt-4 font-semibold text-slate-800">{user.full_name}</p>

      {user.username && <p className="text-gray-500 text-sm">@{user.username}</p>}
      {user.bio && <p className="text-gray-600 mt-2 text-sm px-2">{user.bio}</p>}

      <div className="flex items-center justify-between w-full mt-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{user.location || 'Unknown'}</span>
        </div>

        <div>
          <span className="font-medium text-slate-700">{user.followers?.length || 0}</span>{' '}
          Followers
        </div>
      </div>

      <div className="flex mt-4 gap-2 w-full">
        <button
          onClick={handleFollow}
          disabled={isFollowing}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition
            ${isFollowing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
        >
          <UserPlus className="w-4 h-4" />
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button
          onClick={handleConnectionRequest}
          className="w-10 h-10 flex items-center justify-center rounded-md border hover:bg-slate-100 transition group"
        >
          {isConnected ? (
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
