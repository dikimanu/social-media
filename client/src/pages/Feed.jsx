import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
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

  useEffect(() => {
    const controller = new AbortController()

    const fetchFeeds = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        const { data } = await api.get('/api/post/feed', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        })

        if (data.success) setFeeds(data.posts)
        else toast.error(data.message)
      } catch (err) {
        if (err.name !== 'AbortError') toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeeds()
    return () => controller.abort()
  }, [getToken])

  if (loading) return <Loading />

  return (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 flex justify-start lg:gap-8 relative">
      {/* Left column: Stories + Posts */}
      <div className="w-full max-w-2xl px-2 sm:px-4">
        <StoriesBar />
        <div className="p-2 sm:p-4 space-y-6">
          {feeds.length === 0 ? (
            <p className="text-center text-gray-500">No posts available.</p>
          ) : (
            feeds.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 sticky top-0 space-y-6">
        <RecentMessages mobile={false} />
      </div>

      {/* Mobile floating button */}
      <div className="lg:hidden">
        <RecentMessages mobile={true} />
      </div>
    </div>
  )
}

export default Feed
