import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ExplorePage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [followingStates, setFollowingStates] = useState({})

  useEffect(() => {
    fetchExploreUsers()
  }, [])

  const fetchExploreUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users/explore/')
      setUsers(response.data)
      
      // Initialize following states
      const states = {}
      response.data.forEach(user => {
        states[user.id] = false // These are users we're not following
      })
      setFollowingStates(states)
    } catch (error) {
      console.error('Error fetching explore users:', error)
      setError('Failed to load users to explore')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(`/api/auth/follow/${userId}/`)
      
      setFollowingStates(prev => ({
        ...prev,
        [userId]: response.data.is_following
      }))

      // Update user's follower count
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, followers_count: response.data.followers_count }
          : user
      ))

      // If user is now being followed, remove them from explore after a short delay
      if (response.data.is_following) {
        setTimeout(() => {
          setUsers(prev => prev.filter(user => user.id !== userId))
        }, 1000)
      }

      // Show success message
      const message = response.data.action === 'followed' ? 'Started following!' : 'Unfollowed!'
      showNotification(message, response.data.action === 'followed' ? 'success' : 'info')

    } catch (error) {
      console.error('Error following user:', error)
      showNotification('Failed to follow user', 'error')
    }
  }

  const showNotification = (message, type) => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    }
    
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchExploreUsers}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔍 Explore People</h1>
        <p className="text-gray-600">Discover new people to follow</p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">You're all caught up!</h2>
          <p className="text-gray-600 mb-4">You're following everyone available, or there are no new users to discover.</p>
          <button 
            onClick={fetchExploreUsers}
            className="btn-primary"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="card hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">{user.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  @{user.username}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Joined {formatDate(user.created_at)}
                </p>
                
                {user.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {user.bio}
                  </p>
                )}

                <div className="flex justify-center space-x-6 mb-4 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{user.followers_count}</div>
                    <div>Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-800">{user.following_count}</div>
                    <div>Following</div>
                  </div>
                </div>

                <button
                  onClick={() => handleFollow(user.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    followingStates[user.id]
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {followingStates[user.id] ? '✓ Following' : '+ Follow'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {users.length > 0 && (
        <div className="text-center mt-8">
          <button 
            onClick={fetchExploreUsers}
            className="btn-secondary"
          >
            🔄 Refresh
          </button>
        </div>
      )}
    </div>
  )
}

export default ExplorePage