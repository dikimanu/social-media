import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PostCard = ({ post }) => {
  const currentUser = useSelector((state) => state.user.value) ?? {}
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [likes, setLikes] = useState(post.likes || [])

  // Highlight hashtags
  const postWithHashtags = post.content?.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600 font-semibold">$1</span>'
  )

  const handleLike = async () => {
    try {
      const token = await getToken()
      const { data } = await api.post(
        '/api/post/like',
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setLikes((prev) =>
          prev.includes(currentUser._id)
            ? prev.filter((id) => id !== currentUser._id)
            : [...prev, currentUser._id]
        )
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-4
                 bg-gradient-to-br from-white via-indigo-50 to-purple-100
                 shadow-xl shadow-indigo-300/30
                 border border-white/60
                 backdrop-blur-sm"
    >
      {/* User info */}
      <div
        onClick={() => navigate(`/profile/${post.user?._id}`)}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <img
          src={post.user?.profile_picture || ''}
          alt=""
          className="w-11 h-11 rounded-full object-cover
                     ring-2 ring-indigo-400/40
                     shadow-md group-hover:scale-105 transition"
        />
        <div>
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <span>{post.user?.full_name || 'Unknown'}</span>
            <BadgeCheck className="w-4 h-4 text-indigo-500 drop-shadow" />
          </div>
          <div className="text-xs text-slate-500">
            @{post.user?.username || 'username'} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div
          className="text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* Images */}
      {post.image_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.image_urls.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`w-full rounded-xl object-cover
                          shadow-md hover:shadow-lg transition
                          ${
                            post.image_urls.length === 1
                              ? 'col-span-2 max-h-[420px]'
                              : 'h-48'
                          }`}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-8 pt-2 text-slate-600">
        <div className="flex items-center gap-1.5 group">
          <Heart
            onClick={handleLike}
            className={`w-4.5 h-4.5 cursor-pointer transition-all
              ${
                likes.includes(currentUser._id)
                  ? 'text-pink-500 fill-pink-500 drop-shadow'
                  : 'group-hover:text-pink-500'
              }`}
          />
          <span className="text-sm font-medium">
            {likes.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 group hover:text-indigo-500 transition">
          <MessageCircle className="w-4.5 h-4.5" />
          <span className="text-sm font-medium">12</span>
        </div>

        <div className="flex items-center gap-1.5 group hover:text-purple-500 transition">
          <Share2 className="w-4.5 h-4.5" />
          <span className="text-sm font-medium">7</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
