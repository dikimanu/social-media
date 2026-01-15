import React from 'react'

const Loading = ({ height = '100vh' }) => {
  return (
    <div
      style={{ height }}
      className="flex items-center justify-center w-full
                 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="relative">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-70
                     bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        />

        {/* Spinner */}
        <div
          className="relative w-12 h-12 rounded-full
                     border-[3px] border-transparent
                     border-t-indigo-500
                     border-r-purple-500
                     border-b-pink-500
                     animate-spin shadow-lg"
        />
      </div>
    </div>
  )
}

export default Loading
