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
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setStories(data.stories ?? [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchStories()
  }, [])

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-3 pb-5">
        {/* Add Story */}
        <button
          onClick={() => setShowModal(true)}
          className="relative rounded-lg shadow-sm min-w-[7.5rem] max-w-[7.5rem] max-h-40 aspect-[3/4] border-2 border-dashed border-indigo-300"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-700">Create Story</p>
          </div>
        </button>

        {/* Stories */}
        {stories.map((story, index) => (
          <div
            key={story._id ?? index}
            onClick={() => setViewStory(story)}
            className="relative rounded-lg shadow-sm min-w-[7.5rem] max-w-[7.5rem] max-h-40 aspect-[3/4] cursor-pointer bg-gradient-to-b from-indigo-500 to-purple-600 overflow-hidden"
          >
            <img
              src={story.user?.profile_picture ?? ''}
              alt={story.user?.full_name ?? 'Story User'}
              className="absolute size-8 top-3 left-3 z-10 rounded-full ring-2 ring-white"
            />

            <p className="absolute top-[4.5rem] left-3 text-white/70 text-sm truncate z-10">
              {story.content ?? ''}
            </p>

            <p className="absolute bottom-1 right-2 text-xs text-white z-10">
              {story.createdAt ? moment(story.createdAt).fromNow() : ''}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <StoryModal
          setShowModal={setShowModal}
          fetchStories={fetchStories}
        />
      )}

      {viewStory && (
        <StoryViewer
          viewStory={viewStory}
          setViewStory={setViewStory}
        />
      )}
    </div>
  )
}

export default StoriesBar
