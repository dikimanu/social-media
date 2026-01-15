import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import MenuItems from './MenuItems'
import { CirclePlus, LogOut } from 'lucide-react'
import { UserButton, useClerk } from '@clerk/clerk-react'
import { useSelector } from 'react-redux'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)
  const { signOut } = useClerk()

  return (
    <div
      className={`w-60 xl:w-72 
      bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50
      border-r border-indigo-200/40
      flex flex-col justify-between items-center
      max-sm:absolute top-0 bottom-0 z-20
      shadow-xl shadow-indigo-300/30
      ${
        sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Top */}
      <div className="w-full">
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          className="w-28 ml-7 my-4 cursor-pointer
                     drop-shadow-md hover:scale-105 transition"
          alt="Pingup Logo"
        />

        <hr className="border-indigo-200/60 mb-8 mx-4" />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        {/* Create Post */}
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-8 mx-6 rounded-xl
                     bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                     hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                     shadow-lg shadow-purple-400/40
                     hover:shadow-pink-500/50
                     active:scale-95 transition-all duration-300
                     text-white font-medium cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      {/* Bottom User Section */}
      <div className="w-full border-t border-indigo-200/50
                      bg-white/40 backdrop-blur-md
                      p-4 px-7 flex items-center justify-between">
        <div className="flex gap-3 items-center cursor-pointer">
          <div className="ring-2 ring-indigo-400/40 rounded-full">
            <UserButton />
          </div>
          <div>
            <h1 className="text-sm font-semibold
                           bg-gradient-to-r from-indigo-600 to-purple-600
                           bg-clip-text text-transparent">
              {user?.full_name ?? 'Loading...'}
            </h1>
            <p className="text-xs text-slate-500">
              @{user?.username ?? 'username'}
            </p>
          </div>
        </div>

        <LogOut
          className="w-5 text-slate-400 hover:text-red-500
                     hover:scale-110 transition cursor-pointer"
          onClick={signOut}
        />
      </div>
    </div>
  )
}

export default Sidebar
