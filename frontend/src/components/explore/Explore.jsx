import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

const Explore = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [followingList, setFollowingList] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users/')
      setUsers(response.data.filter(u => u.id !== user.id))
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(`/api/auth/follow/${userId}/`)
      
      if (response.data.is_following) {
        setFollowingList([...followingList, userId])
      } else {
        setFollowingList(followingList.filter(id => id !== userId))
      }

      // Update user followers count
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, followers_count: response.data.followers_count }
          : u
      ))
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Discover People</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(exploreUser => (
          <div key={exploreUser.id} className="card text-center">
            <div className="text-4xl mb-4">{exploreUser.avatar}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">@{exploreUser.username}</h3>
            <p className="text-gray-600 mb-4">{exploreUser.email}</p>
            <div className="flex justify-center space-x-4 mb-4 text-sm text-gray-600">
              <span>{exploreUser.followers_count} followers</span>
              <span>{exploreUser.following_count} following</span>
            </div>
            <button
              onClick={() => handleFollow(exploreUser.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                followingList.includes(exploreUser.id)
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {followingList.includes(exploreUser.id) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explore
