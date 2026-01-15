import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Loading from '../components/Loading'
import { useSelector } from 'react-redux'

const Layout = () => {
  const user = useSelector((state) => state.user.value)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return user ? (
    <div
      className="
        w-full flex h-screen overflow-hidden
        bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
      "
    >
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div
        className="
          flex-1
          bg-white/70 backdrop-blur-xl
          shadow-inner
          overflow-y-auto
        "
      >
        <Outlet />
      </div>

      {/* Mobile Toggle */}
      {sidebarOpen ? (
        <X
          className="
            absolute top-4 right-4 z-50
            w-11 h-11 p-2
            rounded-full
            bg-white/80 backdrop-blur
            shadow-lg
            text-slate-700
            hover:bg-white
            hover:scale-105
            active:scale-95
            transition
            sm:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="
            absolute top-4 right-4 z-50
            w-11 h-11 p-2
            rounded-full
            bg-gradient-to-r from-indigo-500 to-purple-600
            text-white
            shadow-lg
            hover:from-indigo-600 hover:to-purple-700
            hover:scale-105
            active:scale-95
            transition
            sm:hidden
          "
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  )
}

export default Layout
