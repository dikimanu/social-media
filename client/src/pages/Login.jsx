import React from 'react'
import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      {/* Background */}
      <img
        src={assets.bgImage}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 w-full h-full object-cover"
      />

      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-10 lg:pl-40">
        <img
          src={assets.logo}
          alt="Pingup Logo"
          className="h-12 object-contain"
        />

        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img
              src={assets.group_users}
              alt=""
              className="h-8 md:h-10"
            />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p className="text-sm text-indigo-900">
                Used by 12 million people
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            More than just friends.
            <br />
            Truly connect.
          </h1>

          <p className="mt-3 text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md">
            Connect with a global community on Pingup
          </p>
        </div>

        <span className="md:h-10" />
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default Login
