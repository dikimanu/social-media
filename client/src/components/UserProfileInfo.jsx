import React from 'react'
import moment from 'moment'
import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit, currentUserId }) => {
  return (
    <div className="relative py-8 px-6 md:px-8
                    bg-gradient-to-br from-white via-indigo-50 to-purple-50
                    shadow-xl shadow-indigo-300/20
                    rounded-2xl">

      <div>
        {/* Avatar */}
        <img
          src={user.profile_picture}
          alt=""
          className="absolute -top-16 left-6 w-28 h-28 rounded-full
                     border-4 border-white shadow-lg shadow-indigo-300/40
                     z-20 object-cover transition-transform hover:scale-105"
        />

        <div className="w-full pt-20 md:pt-0 md:pl-40">
          {/* Name + Edit */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-800
                               bg-gradient-to-r from-indigo-600 to-purple-600
                               bg-clip-text text-transparent">
                  {user.full_name}
                </h1>
                <Verified className="w-5 h-5 text-indigo-500 drop-shadow" />
              </div>

              <p className="text-sm text-indigo-600 mt-1">
                {user.username ? `@${user.username}` : 'Add a username'}
              </p>
            </div>

            {/* Edit button */}
            {profileId === currentUserId && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm
                           bg-white/80 backdrop-blur rounded-md border
                           border-indigo-200 hover:bg-indigo-50
                           shadow hover:shadow-md transition"
              >
                <PenBox className="w-4 h-4 text-indigo-500" />
                Edit
              </button>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-4 text-slate-700 max-w-xl leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5 text-indigo-600">
              <MapPin className="w-4 h-4 text-indigo-500" />
              {user.location || 'Add location'}
            </span>

            <span className="flex items-center gap-1.5 text-indigo-600">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Joined{' '}
              <span className="font-medium text-slate-800">
                {user.createdAt ? moment(user.createdAt).fromNow() : 'N/A'}
              </span>
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6 text-center">
            <div className="transition hover:scale-105">
              <span className="block font-bold text-slate-800 text-lg">
                {posts?.length || 0}
              </span>
              <span className="text-sm text-slate-500">Posts</span>
            </div>

            <div className="transition hover:scale-105">
              <span className="block font-bold text-slate-800 text-lg">
                {user.followers?.length || 0}
              </span>
              <span className="text-sm text-slate-500">Followers</span>
            </div>

            <div className="transition hover:scale-105">
              <span className="block font-bold text-slate-800 text-lg">
                {user.following?.length || 0}
              </span>
              <span className="text-sm text-slate-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo
