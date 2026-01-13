import React, { useEffect, useState } from 'react'
import { ArrowLeft, TextIcon, ImageIcon, Sparkle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    '#ef4444', '#3b82f6', '#8b5cf6',
    '#22c55e', '#eab308', '#000000',
    '#ffffff', '#6b7280', '#f97316',
    '#0ea5e9', '#ec4899', '#7c3aed'
  ]

  const [mode, setMode] = useState('text')
  const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState('')
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const { getToken } = useAuth()
  const MAX_VIDEO_DURATION = 60 // seconds
  const MAX_VIDEO_SIZE_MB = 50 // MB

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Revoke previous preview to prevent memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)

    if (file.type.startsWith("video")) {
      if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
        toast.error(`Video cannot exceed ${MAX_VIDEO_SIZE_MB} MB.`)
        setMedia(null)
        return
      }

      const video = document.createElement('video')
      video.preload = 'metadata'

      video.addEventListener('loadedmetadata', () => {
        window.URL.revokeObjectURL(video.src)
        if (video.duration > MAX_VIDEO_DURATION) {
          toast.error(`Video duration cannot exceed ${MAX_VIDEO_DURATION} seconds.`)
          setMedia(null)
          setPreviewUrl(null)
        } else {
          setMedia(file)
          setPreviewUrl(URL.createObjectURL(file))
          setText('')
          setMode('media')
        }
      })

      video.src = URL.createObjectURL(file)
    } else if (file.type.startsWith("image")) {
      setMedia(file)
      setPreviewUrl(URL.createObjectURL(file))
      setText('')
      setMode('media')
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleCreateStory = async () => {
    const media_type =
      mode === 'media'
        ? media?.type.startsWith('image') ? 'image' : 'video'
        : 'text'

    if (media_type === 'text' && !text.trim()) {
      toast.error("Please enter some text")
      return
    }

    try {
      const formData = new FormData()
      formData.append('content', text)
      formData.append('media_type', media_type)
      if (media) formData.append('media', media)
      formData.append('background_color', background)

      const token = await getToken()
      const { data } = await api.post('/api/story/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setShowModal(false)
        toast.success("Story created successfully")
        fetchStories()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const isTextLightBg = ['#ffffff', '#eab308'].includes(background)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create Story Modal"
    >
      <div className="w-full max-w-md text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white/10 rounded-full"
            aria-label="Close Story Modal"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10" />
        </div>

        {/* Preview */}
        <div
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: background }}
        >
          {mode === 'text' && (
            <textarea
              className={`bg-transparent w-full h-full p-6 text-lg resize-none focus:outline-none ${
                isTextLightBg ? 'text-black' : 'text-white'
              }`}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {mode === 'media' && previewUrl && (
            media?.type.startsWith('image') ? (
              <img src={previewUrl} alt="preview" className="object-contain max-h-full" />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full" controls />
            )
          )}
        </div>

        {/* Background picker */}
        {mode === 'text' && (
          <div className="flex mt-4 gap-2 flex-wrap">
            {bgColors.map((color) => (
              <button
                key={color}
                onClick={() => setBackground(color)}
                className="w-6 h-6 rounded-full ring ring-white/40"
                style={{ backgroundColor: color }}
                aria-label={`Select background color ${color}`}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode('text')
              setMedia(null)
              if (previewUrl) URL.revokeObjectURL(previewUrl)
              setPreviewUrl(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded ${
              mode === 'text' ? 'bg-white text-black' : 'bg-white/10'
            }`}
          >
            <TextIcon size={18} /> Text
          </button>

          <label
            className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${
              mode === 'media' ? 'bg-white text-black' : 'bg-white/10'
            }`}
          >
            <ImageIcon size={18} /> Media
            <input
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={handleMediaUpload}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: 'Saving...',
            })
          }
          disabled={mode === 'text' ? !text.trim() : !media}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed py-2 rounded"
        >
          <Sparkle size={18} />
          Share Story
        </button>
      </div>
    </div>
  )
}

export default StoryModal
