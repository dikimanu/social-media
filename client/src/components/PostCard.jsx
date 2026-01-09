import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const PostCard = ({ post }) => {
  const postWithHashtags = post.content?.replace(
    /(#\w+)/g,
    '<span class="text-indigo-700 font-medium">$1</span>'
  )

  const currentUser = dummyUserData
  const [likes, setLikes] = useState(post.likes || [])

  const handleLike = () => {
    if (likes.includes(currentUser._id)) {
      setLikes(likes.filter(id => id !== currentUser._id))
    } else {
      setLikes([...likes, currentUser._id])
    }
  }

  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      
      {/* user info */}
      <div onClick={()=> navigate('/profile/' + post.user._id)} className="flex items-center gap-3">
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-1 font-medium">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm text-gray-500">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* content */}
      {post.content && (
        <div
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* images */}
      {post.image_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.image_urls.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className={`w-full rounded-lg object-cover ${
                post.image_urls.length === 1 ? 'col-span-2 h-auto' : 'h-48'
              }`}
            />
          ))}
        </div>
      )}

      {/* actions */}
      <div className="flex items-center gap-6 pt-2 text-gray-600">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id)
                ? 'text-red-500 fill-red-500'
                : ''
            }`}
          />
          <span className="text-sm">{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">12</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">7</span>
        </div>
      </div>

    </div>
  )
}

export default PostCard
