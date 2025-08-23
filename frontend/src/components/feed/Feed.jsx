import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PostCard from './PostCard'
import CreatePost from './CreatePost'
import { motion, AnimatePresence } from 'framer-motion'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState(Date.now())
  const [refreshing, setRefreshing] = useState(false)
  const [notification, setNotification] = useState(null)
  const [followNetwork, setFollowNetwork] = useState({ followers: [], following: [] })
  const [currentUserId, setCurrentUserId] = useState(null)
  const syncInterval = useRef(null)
  const notificationTimeout = useRef(null)

  useEffect(() => {
    initializeUser()
  }, [])

  useEffect(() => {
    if (currentUserId) {
      fetchFollowNetwork()
      fetchPosts()
      startBackgroundSync()
    }
  }, [currentUserId])

  useEffect(() => {
    // Focus/blur events for better UX
    const handleFocus = () => syncWithServer()
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncWithServer()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      stopBackgroundSync()
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current)
      }
    }
  }, [])

  // Initialize current user
  const initializeUser = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (!currentUser || !currentUser.id) {
        // Try to get user info from profile endpoint
        const profileResponse = await axios.get('/api/auth/profile/')
        const userData = profileResponse.data
        localStorage.setItem('user', JSON.stringify(userData))
        setCurrentUserId(userData.id)
      } else {
        setCurrentUserId(currentUser.id)
      }
    } catch (error) {
      console.error('Error initializing user:', error)
      setLoading(false)
    }
  }

  // Fetch user's follow network
  const fetchFollowNetwork = async () => {
    if (!currentUserId) return

    try {
      // Get followers and following
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get(`/api/auth/users/${currentUserId}/followers/`),
        axios.get(`/api/auth/users/${currentUserId}/following/`)
      ])
      
      setFollowNetwork({
        followers: followersResponse.data,
        following: followingResponse.data
      })
    } catch (error) {
      console.error('Error fetching follow network:', error)
      setFollowNetwork({ followers: [], following: [] })
    }
  }

  // Filter posts to only show from followers/following
  const filterPostsByFollowNetwork = (posts) => {
    if (!currentUserId) {
      return []
    }
    
    // Get all user IDs in the follow network (including current user's posts)
    const allowedUserIds = new Set([
      currentUserId, // Include current user's own posts
      ...followNetwork.followers.map(user => user.id),
      ...followNetwork.following.map(user => user.id)
    ])
    
    return posts.filter(post => allowedUserIds.has(post.user.id))
  }

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current)
    }
    
    notificationTimeout.current = setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Initial fetch
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/')
      const allPosts = response.data
      
      // Filter posts to only show from follow network
      const filteredPosts = filterPostsByFollowNetwork(allPosts)
      setPosts(filteredPosts)
      setLastSync(Date.now())
    } catch (error) {
      console.error('Error fetching posts:', error)
      showNotification('Failed to load posts', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Background sync every 30 seconds
  const startBackgroundSync = () => {
    if (syncInterval.current) return
    
    syncInterval.current = setInterval(() => {
      syncWithServer()
    }, 30000) // Sync every 30 seconds
  }

  const stopBackgroundSync = () => {
    if (syncInterval.current) {
      clearInterval(syncInterval.current)
      syncInterval.current = null
    }
  }

  // Sync with server
  const syncWithServer = async () => {
    try {
      const response = await axios.get(`/api/posts/?since=${lastSync}`)
      const serverPosts = response.data
      
      // Filter server posts by follow network
      const filteredServerPosts = filterPostsByFollowNetwork(serverPosts)
      
      if (filteredServerPosts.length > 0) {
        setPosts(prevPosts => {
          // Merge server posts with local posts
          const mergedPosts = [...prevPosts]
          
          filteredServerPosts.forEach(serverPost => {
            const existingIndex = mergedPosts.findIndex(p => p.id === serverPost.id)
            if (existingIndex !== -1) {
              // Update existing post with server data
              mergedPosts[existingIndex] = serverPost
            } else {
              // Add new post
              mergedPosts.unshift(serverPost)
            }
          })
          
          // Sort by creation date
          return mergedPosts.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          )
        })
      }
      
      setLastSync(Date.now())
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  // Handle new post with immediate UI update
  const handlePostCreated = (newPost) => {
    // Always add current user's posts to feed immediately
    setPosts(prevPosts => [newPost, ...prevPosts])
    showNotification('Post created successfully!', 'success')
    
    // Trigger sync to get any other new posts
    setTimeout(syncWithServer, 1000)
  }

  // Handle like with optimistic update
  const handleLike = async (postId) => {
    // Find the post to update
    const postToUpdate = posts.find(p => p.id === postId)
    if (!postToUpdate) return

    // Optimistic update
    const optimisticUpdate = {
      is_liked: !postToUpdate.is_liked,
      likes_count: postToUpdate.is_liked 
        ? postToUpdate.likes_count - 1 
        : postToUpdate.likes_count + 1
    }

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, ...optimisticUpdate }
          : post
      )
    )

    try {
      // Send to server
      const response = await axios.post(`/api/posts/${postId}/like/`)
      
      // Update with server response (in case of discrepancy)
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                is_liked: response.data.is_liked, 
                likes_count: response.data.likes_count 
              }
            : post
        )
      )
    } catch (error) {
      console.error('Error liking post:', error)
      
      // Revert optimistic update on error
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                is_liked: postToUpdate.is_liked, 
                likes_count: postToUpdate.likes_count 
              }
            : post
        )
      )
      
      showNotification('Failed to update like. Please try again.', 'error')
    }
  }

  // Handle comment with optimistic update
  const handleComment = async (postId, content) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!currentUser || !currentUser.id) {
      showNotification('Please log in again', 'error')
      return
    }
    
    // Create optimistic comment
    const optimisticComment = {
      id: `temp-${Date.now()}`, // Temporary ID
      user: currentUser,
      content,
      created_at: new Date().toISOString()
    }

    // Add comment optimistically
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, optimisticComment] }
          : post
      )
    )

    try {
      const response = await axios.post(`/api/posts/${postId}/comment/`, { content })
      
      // Replace optimistic comment with server response
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: post.comments.map(comment => 
                  comment.id === optimisticComment.id 
                    ? response.data 
                    : comment
                )
              }
            : post
        )
      )
    } catch (error) {
      console.error('Error adding comment:', error)
      
      // Remove optimistic comment on error
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: post.comments.filter(comment => 
                  comment.id !== optimisticComment.id
                )
              }
            : post
        )
      )
      
      showNotification('Failed to add comment. Please try again.', 'error')
      throw error
    }
  }

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    // Store post for potential restoration
    const postToDelete = posts.find(p => p.id === postId)
    
    // Optimistically remove from UI
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))

    try {
      await axios.delete(`/api/posts/${postId}/delete/`)
      showNotification('Post deleted successfully', 'success')
    } catch (error) {
      console.error('Error deleting post:', error)
      
      // Restore post on error
      if (postToDelete) {
        setPosts(prevPosts => {
          const restored = [...prevPosts, postToDelete]
          return restored.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          )
        })
      }
      
      showNotification('Failed to delete post. Please try again.', 'error')
    }
  }

  // Refresh feed manually
  const refreshFeed = async () => {
    setRefreshing(true)
    await fetchFollowNetwork() // Refresh follow network first
    await fetchPosts()
    showNotification('Feed refreshed', 'success')
  }

  // Calculate network stats
  const getNetworkStats = () => {
    const totalConnections = followNetwork.followers.length + followNetwork.following.length
    const uniqueConnections = new Set([
      ...followNetwork.followers.map(u => u.id),
      ...followNetwork.following.map(u => u.id)
    ]).size
    
    return { totalConnections, uniqueConnections }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized feed...</p>
        </div>
      </div>
    )
  }

  const { totalConnections, uniqueConnections } = getNetworkStats()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with refresh button */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-3 bg-indigo-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              Your Network Feed
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              🔒 Posts from {uniqueConnections} connected users only
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-500 bg-white px-3 py-2 rounded-full shadow-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Synced: {new Date(lastSync).toLocaleTimeString()}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshFeed}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all shadow-sm border border-indigo-100 disabled:opacity-50"
            >
              {refreshing ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              )}
              <span className="text-sm font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-6 mt-6">
        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your network feed is empty</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You'll see posts from people you follow and your followers here. Start by creating your own post or follow more users!
            </p>
            
            {/* Network stats */}
            <div className="bg-indigo-50 p-4 rounded-xl inline-block mb-4">
              <div className="flex items-center justify-center space-x-4 text-sm text-indigo-600">
                <div className="flex items-center">
                  <span className="font-medium">{followNetwork.followers.length}</span>
                  <span className="ml-1">Followers</span>
                </div>
                <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                <div className="flex items-center">
                  <span className="font-medium">{followNetwork.following.length}</span>
                  <span className="ml-1">Following</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl inline-flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm text-yellow-700">
                Only posts from your network will appear here
              </span>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Feed stats */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-sm text-sm text-gray-600">
                <span className="mr-2">📊</span>
                <span>Showing {posts.length} posts from your network</span>
              </div>
            </div>
            
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onDelete={handleDeletePost}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Background sync indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-3 py-2 rounded-xl shadow border border-gray-200 flex items-center"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span>Network feed sync enabled</span>
      </motion.div>
    </div>
  )
}

export default Feed