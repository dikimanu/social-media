import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import moment from 'moment'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import ProfileModal from '../components/ProfileModal'

const Profile = () => {
  const { profileId } = useParams()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])   // ✅ fixed
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    setUser(dummyUserData)
    setPosts(dummyPostsData)               // ✅ fixed
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* profile card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          {/* cover photo */}
          <div className="h-48 bg-gray-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* user info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
            {['posts', 'media', 'likes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                  ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* posts */}
          {activeTab === 'posts' && (
            <div className="mt-6 space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* media */}
          {activeTab === 'media' && (
            <div className="flex flex-wrap gap-4 mt-6 max-w-6xl">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) =>
                  post.image_urls.map((image, index) => (
                    <Link
                      key={`${post._id}-${index}`}   // ✅ fixed key
                      target="_blank"
                      to={image}
                      className="relative group"
                    >
                      <img
                        src={image}
                        className="w-64 aspect-video object-cover rounded-lg"
                        alt=""
                      />
                      <p className="absolute bottom-0 right-0 text-xs p-1 px-3
                        backdrop-blur bg-black/40 text-white opacity-0
                        group-hover:opacity-100 transition duration-300">
                        Posted {moment(post.createdAt).fromNow()}
                      </p>
                    </Link>
                  ))
                )}
            </div>
          )}
        </div>
      </div>

      {/* edit profile modal */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  )
}

export default Profile
