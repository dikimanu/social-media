import React, { useEffect, useState } from 'react'
import { BadgeCheck, X } from 'lucide-react'

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!viewStory) return

    setProgress(0)

    let timer
    let interval

    // Auto progress for text & image
    if (viewStory.media_type !== 'video') {
      const duration = 10000
      const step = 100
      let elapsed = 0

      interval = setInterval(() => {
        elapsed += step
        setProgress((elapsed / duration) * 100)
      }, step)

      timer = setTimeout(() => {
        setViewStory(null)
      }, duration)
    }

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [viewStory, setViewStory])

  if (!viewStory) return null

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return (
          <img
            src={viewStory.media_url}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        )

      case 'video':
        return (
          <video
            src={viewStory.media_url}
            autoPlay
            controls
            onEnded={() => setViewStory(null)}
            className="max-h-full max-w-full object-contain"
          />
        )

      case 'text':
        return (
          <div className="w-full h-full flex items-center justify-center text-center px-6">
            <p className="text-2xl md:text-3xl font-semibold text-white">
              {viewStory.content}
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{
        backgroundColor:
          viewStory.media_type === 'text'
            ? viewStory.background_color || '#000'
            : '#000',
      }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-20">
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* User info (unchanged) */}
      <div className="absolute top-4 left-4 flex items-center gap-3 text-white z-20">
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex items-center gap-1 text-sm font-medium">
          {viewStory.user?.full_name}
          <BadgeCheck size={16} className="text-blue-400" />
        </div>
      </div>

      {/* Close button — TOP CENTER */}
      <button
        onClick={() => setViewStory(null)}
        className="
          absolute top-4 left-1/2 -translate-x-1/2
          p-2 text-white
          hover:bg-white/10 rounded-full
          z-20
        "
        aria-label="Close story"
      >
        <X />
      </button>

      {/* Story content (unchanged for desktop) */}
      <div className="w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  )
}

export default StoryViewer
