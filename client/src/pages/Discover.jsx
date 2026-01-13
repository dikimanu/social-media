import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'

const Discover = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        setUsers([]) 
        setLoading(true)

        const token = await getToken()
        const { data } = await api.post(
          '/api/user/discover',
          { input },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (data.success) {
          setUsers(data.users)
        } else {
          toast.error(data.message)
        }

        setInput('')
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false) // ✅ fixed
      }
    }
  }

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token))
    })
  }, [dispatch, getToken])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>
          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search people by name, username, bio, or location..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyUp={handleSearch}
            />
          </div>
        </div>

        {/* Results */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard user={user} key={user._id} />
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && <Loading height="60vh" />}
      </div>
    </div>
  )
}

export default Discover
