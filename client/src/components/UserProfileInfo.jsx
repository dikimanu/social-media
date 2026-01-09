import React from 'react'
import moment from 'moment'
import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  return (
    <div className="relative py-6 px-6 md:px-8 bg-white">
      <div>
        {/* Avatar */}
        <div>
          <img
            src={user.profile_picture}
            alt=""
            className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white z-20 object-cover"
          />
        </div>

        <div className="w-full pt-16 md:pt-0 md:pl-36">
          {/* Name + Edit */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-800">
                  {user.full_name}
                </h1>
                <Verified className="w-5 h-5 text-indigo-500" />
              </div>

              <p className="text-gray-600 text-sm">
                {user.username ? `@${user.username}` : 'Add a username'}
              </p>
            </div>

            {/* Edit button (own profile only) */}
            {!profileId && (
              <button
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-slate-100 transition"
              >
                <PenBox className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-4 text-gray-700 max-w-xl">
              {user.bio}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {user.location || 'Add location'}
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined{' '}
              <span className="font-medium">
                {moment(user.createdAt).fromNow()}
              </span>
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6 text-center">
            <div>
              <span className="block font-semibold text-slate-800">
                {posts.length}
              </span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>

            <div>
              <span className="block font-semibold text-slate-800">
                {user.followers.length}
              </span>
              <span className="text-sm text-gray-500">Followers</span>
            </div>

            <div>
              <span className="block font-semibold text-slate-800">
                {user.following.length}
              </span>
              <span className="text-sm text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileInfo
