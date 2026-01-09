import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModal = ({ setShowEdit }) => {
  const user = dummyUserData

  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  })

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setShowEdit(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>

          <form className="space-y-5" onSubmit={handleSaveProfile}>
            {/* Profile Picture */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Profile Picture
              </label>

              <label
                htmlFor="profile_picture"
                className="relative group block w-fit mt-2 cursor-pointer"
              >
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : user.profile_picture
                  }
                  alt=""
                  className="w-24 h-24 rounded-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>

              <input
                hidden
                type="file"
                accept="image/*"
                id="profile_picture"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    profile_picture: e.target.files[0],
                  })
                }
              />
            </div>

            {/* Cover Photo */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Cover Photo
              </label>

              <label
                htmlFor="cover_photo"
                className="relative group block mt-2 cursor-pointer"
              >
                <img
                  src={
                    editForm.cover_photo
                      ? URL.createObjectURL(editForm.cover_photo)
                      : user.cover_photo
                  }
                  alt=""
                  className="w-full h-40 object-cover rounded-lg"
                />

                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>

              <input
                hidden
                type="file"
                accept="image/*"
                id="cover_photo"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    cover_photo: e.target.files[0],
                  })
                }
              />
            </div>

            {/* Inputs */}
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter full name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Bio</label>
              <textarea
                rows={3}
                className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter bio"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter location"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
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
