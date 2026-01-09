import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { X, Image } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {}

  const user = dummyUserData

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>
          <p className="text-slate-600">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form */}
        <div className="max-w-xl bg-white p-4 sm:p-8 rounded-xl shadow-md space-y-4">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <img
              src={user.profile_picture}
              alt=""
              className="w-12 h-12 rounded-full object-cover shadow"
            />
            <div>
              <h2 className="font-semibold text-slate-800">
                {user.full_name}
              </h2>
              <p className="text-sm text-gray-500">
                @{user.username}
              </p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className="w-full min-h-[120px] resize-none border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="What is happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((image, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 rounded-md"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t">
            
            <label
              htmlFor="images"
              className="cursor-pointer text-gray-600 hover:text-indigo-600"
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
                  success: <p>Post Added</p>,
                  error: <p>Post Not Added</p>,
                })
              }
              className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium
              hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
