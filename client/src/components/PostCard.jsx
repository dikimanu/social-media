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

  const postWithHashtags = post.content?.replace(
    /(#\w+)/g,
    '<span class="text-indigo-500 font-semibold">$1</span>'
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
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="w-full max-w-full rounded-2xl p-4
                    bg-white/30 backdrop-blur-xl border border-white/20
                    shadow-lg shadow-purple-300/20
                    hover:shadow-purple-400/40 hover:-translate-y-1
                    transition-all duration-300 space-y-3">
      {/* User */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/profile/${post.user?._id}`)}
      >
        <img
          src={post.user?.profile_picture ?? ''}
          alt=""
          className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-400 shadow-sm"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-purple-900 flex items-center gap-1">
            {post.user?.full_name ?? 'Unknown'} <BadgeCheck className="w-3 h-3 text-indigo-500" />
          </span>
          <span className="text-[10px] text-gray-600">
            @{post.user?.username ?? 'username'} · {moment(post.createdAt).fromNow()}
          </span>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <div
          className="text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* Images */}
      {post.image_urls?.length > 0 && (
        <div className={`grid ${post.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {post.image_urls.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full h-auto rounded-xl object-cover shadow-md hover:shadow-lg transition"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-700">
        <div
          className="flex items-center gap-1 cursor-pointer hover:text-pink-500 transition"
          onClick={handleLike}
        >
          <Heart className={`w-4 h-4 ${likes.includes(currentUser._id) ? 'text-pink-500 fill-pink-500 drop-shadow' : ''}`} />
          <span className="text-xs">{likes.length}</span>
        </div>
        <div className="flex items-center gap-1 hover:text-indigo-500 transition">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">12</span>
        </div>
        <div className="flex items-center gap-1 hover:text-purple-500 transition">
          <Share2 className="w-4 h-4" />
          <span className="text-xs">7</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
