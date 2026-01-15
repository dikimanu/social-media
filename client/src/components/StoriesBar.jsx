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
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl 
                    px-4 py-5 overflow-x-auto no-scrollbar
                    bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
                    rounded-2xl shadow-inner">

      <div className="flex gap-4 pb-4">

        {/* Add Story */}
        <button
          onClick={() => setShowModal(true)}
          className="relative rounded-2xl min-w-[7.5rem] max-w-[7.5rem] max-h-40 aspect-[3/4]
                     bg-gradient-to-br from-white via-indigo-50 to-purple-100
                     border border-white/60 backdrop-blur-xl
                     shadow-lg shadow-indigo-300/40
                     hover:shadow-purple-400/50 hover:-translate-y-1
                     transition-all duration-300"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-12 rounded-full
                            bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500
                            flex items-center justify-center mb-3
                            shadow-xl shadow-pink-400/40">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600
                          bg-clip-text text-transparent">
              Create Story
            </p>
          </div>
        </button>

        {/* Stories */}
        {stories.map((story, index) => (
          <div
            key={story._id ?? index}
            onClick={() => setViewStory(story)}
            className="relative rounded-2xl min-w-[7.5rem] max-w-[7.5rem] max-h-40 aspect-[3/4]
                       cursor-pointer overflow-hidden
                       bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
                       shadow-xl shadow-purple-500/40
                       hover:scale-[1.04] hover:shadow-pink-500/60
                       transition-all duration-300"
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

            {/* Profile */}
            <img
              src={story.user?.profile_picture ?? ''}
              alt={story.user?.full_name ?? 'Story User'}
              className="absolute size-9 top-3 left-3 z-10 rounded-full
                         ring-2 ring-white/90 shadow-md"
            />

            {/* Content */}
            <p className="absolute top-[4.5rem] left-3 right-3 z-10
                          text-white text-sm font-semibold truncate
                          drop-shadow-lg">
              {story.content ?? ''}
            </p>

            {/* Time */}
            <p className="absolute bottom-2 right-3 z-10
                          text-xs text-white/90 drop-shadow">
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
