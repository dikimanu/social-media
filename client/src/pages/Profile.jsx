import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import ProfileModal from '../components/ProfileModal'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios.js'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value)
  const { getToken } = useAuth()
  const { profileId } = useParams()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    try {
      const token = await getToken()
      const idToFetch = profileId || currentUser?._id

      const { data } = await api.post(
        '/api/user/profiles',
        { profileId: idToFetch },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setUser(data.profile)
        setPosts(data.posts || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  useEffect(() => {
    if (currentUser) fetchUser()
  }, [profileId, currentUser?._id])

  if (!user) return <Loading />

  return (
    <div
      className="
        relative h-full overflow-y-scroll p-6
        bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
      "
    >
      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div
          className="
            rounded-2xl overflow-hidden
            bg-white/70 backdrop-blur
            border border-white/40
            shadow-xl
          "
        >
          {/* Cover Photo */}
          <div className="h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover relative z-10"
              />
            )}
          </div>

          {/* User Info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId || currentUser?._id}
            setShowEdit={setShowEdit}
            currentUserId={currentUser?._id}
          />
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div
            className="
              bg-white/70 backdrop-blur
              rounded-xl shadow-lg
              p-1 flex max-w-md mx-auto
            "
          >
            {['posts', 'media', 'likes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Posts */}
          {activeTab === 'posts' && (
            <div className="mt-8 space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className="flex flex-wrap gap-4 mt-8 max-w-6xl">
              {posts
                .filter((post) => post.image_urls?.length > 0)
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <a
                      key={`${post._id}-${index}`}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        relative group
                        rounded-xl overflow-hidden
                        shadow-lg
                        hover:shadow-xl
                        transition
                      "
                    >
                      <img
                        src={image}
                        className="w-64 aspect-video object-cover"
                        alt=""
                      />
                      <p
                        className="
                          absolute bottom-0 right-0 text-xs px-3 py-1
                          backdrop-blur bg-black/40 text-white
                          opacity-0 group-hover:opacity-100
                          transition duration-300
                        "
                      >
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </a>
                  ))
                )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  )
}

export default Profile
