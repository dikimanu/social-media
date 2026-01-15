import React, { useEffect, useState } from 'react'
import { ArrowLeft, TextIcon, ImageIcon, Sparkle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'

const StoryModal = ({ setShowModal, fetchStories }) => {
  const colors = [
    '#ef4444', '#3b82f6', '#8b5cf6', '#22c55e',
    '#eab308', '#000000', '#6b7280'
  ]

  const [mode, setMode] = useState('text')
  const [background, setBackground] = useState(colors[0])
  const [text, setText] = useState('')
  const [media, setMedia] = useState(null)
  const [preview, setPreview] = useState(null)
  const { getToken } = useAuth()

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview)
  }, [preview])

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMedia(file)
    setPreview(URL.createObjectURL(file))
    setMode('media')
    setText('')
  }

  const handleCreate = async () => {
    if (mode === 'text' && !text.trim()) {
      toast.error('Enter some text')
      return
    }

    try {
      const form = new FormData()
      form.append('content', text)
      form.append(
        'media_type',
        mode === 'media'
          ? media.type.startsWith('image') ? 'image' : 'video'
          : 'text'
      )
      if (media) form.append('media', media)
      form.append('background_color', background)

      const token = await getToken()
      const { data } = await api.post('/api/story/create', form, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success('Story posted')
        setShowModal(false)
        fetchStories()
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-white">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft />
          </button>

          <span className="font-semibold tracking-wide">
            Create Story
          </span>

          <span className="w-8" />
        </div>

        {/* Preview */}
        <div
          className="
            relative rounded-2xl h-[360px] sm:h-96
            flex items-center justify-center overflow-hidden
            shadow-2xl border border-white/20
          "
          style={{ backgroundColor: background }}
        >
          {/* subtle overlay */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />

          {mode === 'text' && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="
                relative z-10 w-full h-full bg-transparent
                resize-none p-6 text-xl font-medium
                text-center outline-none placeholder-white/70
              "
            />
          )}

          {mode === 'media' && preview && (
            media.type.startsWith('image') ? (
              <img
                src={preview}
                className="relative z-10 object-contain h-full"
              />
            ) : (
              <video
                src={preview}
                controls
                className="relative z-10 object-contain h-full"
              />
            )
          )}
        </div>

        {/* Colors */}
        {mode === 'text' && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setBackground(c)}
                className="
                  w-7 h-7 rounded-full
                  ring-2 ring-white/40
                  hover:scale-110 transition
                "
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setMode('text')
              setMedia(null)
              setPreview(null)
            }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              transition font-medium
              ${
                mode === 'text'
                  ? 'bg-white text-black shadow'
                  : 'bg-white/10 hover:bg-white/20'
              }
            `}
          >
            <TextIcon size={16} /> Text
          </button>

          <label
            className="
              flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/10 hover:bg-white/20
              cursor-pointer transition font-medium
            "
          >
            <ImageIcon size={16} /> Media
            <input
              type="file"
              hidden
              accept="image/*,video/*"
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* Share Button */}
        <button
          onClick={handleCreate}
          className="
            w-full mt-5 py-3 rounded-full
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            hover:from-indigo-600 hover:to-pink-600
            font-semibold tracking-wide
            flex items-center justify-center gap-2
            shadow-lg transition
          "
        >
          <Sparkle size={16} /> Share Story
        </button>
      </div>
    </div>
  )
}

export default StoryModal
