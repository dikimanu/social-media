import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import RecentMessages from '../components/RecentMessages'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  const fetchFeeds = async () => {   // ✅ async added
    try {
      setLoading(true)

      const token = await getToken() // ✅ await moved correctly
      const { data } = await api.get('/api/post/feed', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setFeeds(data.posts)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post, index) => (
            <PostCard key={post._id || index} post={post} />
          ))}
        </div>
      </div>

      <div className="sticky top-0 w-80 shrink-0">
        <div className="bg-white p-4 rounded-md shadow flex flex-col gap-2">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            className="w-full h-40 rounded-md object-cover"
            alt=""
          />
          <p className="text-slate-600">Email marketing</p>
          <p className="text-slate-400 text-sm">
            Supercharge your marketing with a powerful easy-to-use platform built for results.
          </p>
        </div>

        <RecentMessages />
      </div>
    </div>
  )
}

export default Feed
