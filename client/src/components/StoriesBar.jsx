import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [viewStory, setViewStory] = useState(null)
  const { getToken } = useAuth()

  const fetchStories = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/story/get', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) setStories(data.stories ?? [])
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  return (
    <div className="w-full max-w-full overflow-x-auto no-scrollbar flex gap-3 py-3 px-1">
      {/* Add Story */}
      <button
        onClick={() => setShowModal(true)}
        className="flex-shrink-0 min-w-[7.5rem] aspect-[3/4] rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-purple-100 border border-white/60 shadow-lg hover:shadow-purple-400/50 transition flex flex-col items-center justify-center p-2"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-2 shadow-md">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <p className="text-xs font-semibold text-center text-indigo-600">Create Story</p>
      </button>

      {/* Stories */}
      {stories.map((story) => (
        <div
          key={story._id}
          onClick={() => setViewStory(story)}
          className="flex-shrink-0 min-w-[7.5rem] aspect-[3/4] rounded-2xl cursor-pointer overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md relative"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <img
            src={story.user?.profile_picture ?? ''}
            alt={story.user?.full_name ?? 'Story'}
            className="absolute top-2 left-2 w-8 h-8 rounded-full ring-2 ring-white shadow-sm z-10"
          />
          <p className="absolute bottom-6 left-2 right-2 text-xs font-semibold text-white truncate z-10">
            {story.content ?? ''}
          </p>
          <p className="absolute bottom-2 right-2 text-[10px] text-white/90 z-10">
            {story.createdAt ? moment(story.createdAt).fromNow() : ''}
          </p>
        </div>
      ))}

      {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />}
    </div>
  )
}

export default StoriesBar
