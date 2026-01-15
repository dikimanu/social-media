import React, { useEffect, useState } from 'react'
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
          signal: controller.signal,
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
    <div className="flex flex-col lg:flex-row w-full max-w-full h-screen overflow-x-hidden bg-gray-50">
      {/* Main feed column */}
      <div className="w-full lg:flex-1 overflow-y-auto px-2 sm:px-4 py-2">
        <StoriesBar />

        <div className="mt-2 space-y-4">
          {feeds.length === 0 ? (
            <p className="text-center text-xs text-gray-500">No posts available.</p>
          ) : (
            feeds.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>

      {/* Desktop sidebar: Sponsored + RecentMessages */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 sticky top-0 space-y-4 p-2">
        <RecentMessages mobile={false} />
      </div>

      {/* Mobile floating messages */}
      <RecentMessages mobile />
    </div>
  )
}

export default Feed
