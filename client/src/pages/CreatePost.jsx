import React, { useState } from 'react'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const { getToken } = useAuth()
  const user = useSelector((state) => state.user.value)

  const handleSubmit = async () => {
    if (!images.length && !content) {
      toast.error('Please add at least one image or text')
      return
    }

    setLoading(true)
    const postType =
      images.length && content
        ? 'text_with_image'
        : images.length
        ? 'image'
        : 'text'

    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('post_type', postType)

      images.forEach((image) => {
        formData.append('images', image)
      })

      const token = await getToken()
      const { data } = await api.post(
        '/api/post/add',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (data.success) {
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
    ">
      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-10">
          <h1 className="
            text-3xl font-bold
            bg-gradient-to-r from-indigo-600 to-purple-600
            bg-clip-text text-transparent
          ">
            Create Post
          </h1>
          <p className="text-slate-600 mt-1">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form Card */}
        <div className="
          max-w-xl
          bg-white/80 backdrop-blur-xl
          p-5 sm:p-8
          rounded-2xl
          shadow-lg
          space-y-5
        ">

          {/* Header */}
          <div className="flex items-center gap-4">
            <img
              src={user.profile_picture}
              alt=""
              className="
                w-12 h-12 rounded-full object-cover
                ring-2 ring-indigo-500/30
                shadow
              "
            />
            <div>
              <h2 className="font-semibold text-slate-800">
                {user.full_name}
              </h2>
              <p className="text-sm text-slate-500">
                @{user.username}
              </p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className="
              w-full min-h-[130px] resize-none
              rounded-xl p-4 text-sm
              bg-slate-50/70
              border border-slate-200
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500/60
              transition
            "
            placeholder="What is happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {images.map((image, i) => (
                <div
                  key={i}
                  className="relative group rounded-xl overflow-hidden shadow"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-24 w-24 object-cover"
                  />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="
                      absolute inset-0
                      hidden group-hover:flex
                      items-center justify-center
                      bg-black/50
                      transition
                    "
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">

            <label
              htmlFor="images"
              className="
                cursor-pointer
                p-2 rounded-full
                text-slate-500
                hover:text-indigo-600
                hover:bg-indigo-50
                transition
              "
            >
              <Image className="w-6 h-6" />
            </label>

            <input
              type="file"
              id="images"
              accept="image/*"
              hidden
              multiple
              onChange={(e) =>
                setImages([...images, ...Array.from(e.target.files)])
              }
            />

            <button
              disabled={loading || (!content.trim() && images.length === 0)}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: 'Uploading...',
                  success: 'Post Added',
                  error: 'Post Not Added',
                })
              }
              className="
                px-6 py-2 rounded-full
                text-sm font-semibold text-white
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                shadow-lg
                hover:brightness-110
                active:scale-95
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              Publish Post
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreatePost
