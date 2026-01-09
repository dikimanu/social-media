import React, { useEffect, useState } from 'react'
import { ArrowLeft, TextIcon, ImageIcon, Sparkle } from 'lucide-react'
import { toast } from 'react-hot-toast'

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

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMedia(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleCreateStory = async () => {
    // simulate API call
    await new Promise((res) => setTimeout(res, 800))

    fetchStories()
    setShowModal(false)
  }

  const isTextLightBg = background === '#ffffff' || background === '#eab308'

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="w-full max-w-md text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white/10 rounded-full"
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
              <img src={previewUrl} alt="" className="object-contain max-h-full" />
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
              onChange={(e) => {
                setMode('media')
                setBackground('#000000')
                handleMediaUpload(e)
              }}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: 'Saving...',
              success: 'Story added',
              error: (e) => e?.message || 'Failed to add story',
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
