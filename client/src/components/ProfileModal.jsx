import React, { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../features/user/userSlice'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const ProfileModal = ({ setShowEdit }) => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()
  const user = useSelector((state) => state.user.value) ?? {}

  const [editForm, setEditForm] = useState({
    username: user.username || '',
    bio: user.bio || '',
    location: user.location || '',
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name || '',
  })

  useEffect(() => {
    return () => {
      if (editForm.profile_picture) URL.revokeObjectURL(editForm.profile_picture)
      if (editForm.cover_photo) URL.revokeObjectURL(editForm.cover_photo)
    }
  }, [editForm.profile_picture, editForm.cover_photo])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      const userData = new FormData()
      const { full_name, username, bio, location, profile_picture, cover_photo } = editForm

      userData.append('username', username)
      userData.append('bio', bio)
      userData.append('location', location)
      userData.append('full_name', full_name)

      if (profile_picture) userData.append('profile', profile_picture)
      if (cover_photo) userData.append('cover', cover_photo)

      const token = await getToken()
      dispatch(updateUser({ userData, token }))
      setShowEdit(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50
                    bg-gradient-to-br from-black/60 via-black/50 to-black/60
                    backdrop-blur-sm overflow-y-auto">

      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="rounded-2xl p-6
                        bg-gradient-to-br from-white via-indigo-50 to-purple-100
                        shadow-2xl shadow-indigo-400/30
                        border border-white/60">

          <h1 className="text-2xl font-bold mb-6
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         bg-clip-text text-transparent">
            Edit Profile
          </h1>

          <form
            className="space-y-6"
            onSubmit={(e) =>
              toast.promise(handleSaveProfile(e), {
                loading: 'Saving...',
                success: 'Saved!',
                error: 'Failed',
              })
            }
          >
            {/* Profile Picture */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Profile Picture
              </label>

              <label
                htmlFor="profile_picture"
                className="relative group block w-fit mt-3 cursor-pointer"
              >
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : user.profile_picture || ''
                  }
                  alt=""
                  className="w-28 h-28 rounded-full object-cover
                             ring-4 ring-indigo-400/40
                             shadow-lg shadow-indigo-300/40"
                />

                <div className="absolute inset-0 rounded-full
                                bg-gradient-to-tr from-indigo-600/60 to-purple-600/60
                                opacity-0 group-hover:opacity-100
                                flex items-center justify-center
                                transition">
                  <Pencil className="w-6 h-6 text-white drop-shadow" />
                </div>
              </label>

              <input
                hidden
                type="file"
                accept="image/*"
                id="profile_picture"
                onChange={(e) =>
                  setEditForm({ ...editForm, profile_picture: e.target.files[0] })
                }
              />
            </div>

            {/* Cover Photo */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Cover Photo
              </label>

              <label
                htmlFor="cover_photo"
                className="relative group block mt-3 cursor-pointer"
              >
                <img
                  src={
                    editForm.cover_photo
                      ? URL.createObjectURL(editForm.cover_photo)
                      : user.cover_photo || ''
                  }
                  alt=""
                  className="w-full h-44 object-cover rounded-xl
                             shadow-lg"
                />

                <div className="absolute inset-0 rounded-xl
                                bg-gradient-to-tr from-indigo-600/60 to-purple-600/60
                                opacity-0 group-hover:opacity-100
                                flex items-center justify-center
                                transition">
                  <Pencil className="w-6 h-6 text-white drop-shadow" />
                </div>
              </label>

              <input
                hidden
                type="file"
                accept="image/*"
                id="cover_photo"
                onChange={(e) =>
                  setEditForm({ ...editForm, cover_photo: e.target.files[0] })
                }
              />
            </div>

            {/* Inputs */}
            {[
              { label: 'Name', value: editForm.full_name, key: 'full_name', placeholder: 'Enter full name' },
              { label: 'Username', value: editForm.username, key: 'username', placeholder: 'Enter username' },
              { label: 'Location', value: editForm.location, key: 'location', placeholder: 'Enter location' },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-sm font-medium text-slate-700">
                  {field.label}
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-4 py-2.5 rounded-xl
                             bg-white/80 backdrop-blur
                             border border-indigo-200/50
                             outline-none
                             focus:ring-2 focus:ring-indigo-500/50
                             shadow-sm"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) =>
                    setEditForm({ ...editForm, [field.key]: e.target.value })
                  }
                />
              </div>
            ))}

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full mt-1 px-4 py-2.5 rounded-xl
                           bg-white/80 backdrop-blur
                           border border-indigo-200/50
                           outline-none
                           focus:ring-2 focus:ring-indigo-500/50
                           shadow-sm resize-none"
                placeholder="Enter bio"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-5 py-2.5 rounded-xl
                           bg-white/70 border border-slate-300
                           text-slate-600
                           hover:bg-white hover:shadow
                           transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-white font-medium
                           bg-gradient-to-r from-indigo-500 to-purple-600
                           hover:from-indigo-600 hover:to-purple-700
                           shadow-lg shadow-indigo-400/40
                           active:scale-95 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
