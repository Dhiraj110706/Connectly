// hooks/useRealTimeUpdates.js
import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

export const useRealTimeUpdates = (options = {}) => {
  const {
    method = 'polling', // 'polling' or 'sse'
    pollingInterval = 3000,
    maxRetries = 3,
    enableNotifications = true
  } = options

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [newPostsAvailable, setNewPostsAvailable] = useState(0)
  
  const lastUpdate = useRef(Date.now())
  const pollingIntervalRef = useRef(null)
  const eventSourceRef = useRef(null)
  const retryCount = useRef(0)
  const isPolling = useRef(false)

  // Initialize real-time updates
  useEffect(() => {
    fetchInitialPosts()
    
    if (method === 'sse') {
      setupSSE()
    } else {
      startPolling()
    }
    
    return () => {
      cleanup()
    }
  }, [method])

  // Fetch initial posts
  const fetchInitialPosts = async () => {
    try {
      const response = await axios.get('/api/posts/')
      setPosts(response.data)
      setConnectionStatus('Connected')
      setLoading(false)
      lastUpdate.current = Date.now()
      retryCount.current = 0
    } catch (error) {
      console.error('Error fetching posts:', error)
      setConnectionStatus('Error')
      setLoading(false)
      handleError()
    }
  }

  // Setup Server-Sent Events
  const setupSSE = useCallback(() => {
    if (eventSourceRef.current) return

    try {
      const token = localStorage.getItem('token')
      eventSourceRef.current = new EventSource(`/api/posts/events/?token=${token}`)
      
      eventSourceRef.current.onopen = () => {
        setConnectionStatus('Connected (SSE)')
        retryCount.current = 0
      }
      
      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          handleRealTimeUpdate(data)
        } catch (error) {
          console.error('Error parsing SSE message:', error)
        }
      }
      
      eventSourceRef.current.onerror = () => {
        setConnectionStatus('Error')
        handleError()
      }
    } catch (error) {
      console.error('Error setting up SSE:', error)
      // Fallback to polling
      startPolling()
    }
  }, [])

  // Start polling
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return
    
    setConnectionStatus('Connected (Polling)')
    
    pollingIntervalRef.current = setInterval(async () => {
      if (!isPolling.current) {
        await checkForUpdates()
      }
    }, pollingInterval)
  }, [pollingInterval])

  // Check for updates (polling)
  const checkForUpdates = async () => {
    if (isPolling.current) return
    
    isPolling.current = true
    try {
      const response = await axios.get(`/api/posts/updates/?since=${lastUpdate.current}`)
      
      if (response.data.posts && response.data.posts.length > 0) {
        handleRealTimeUpdate({
          type: 'feed_update',
          posts: response.data.posts
        })
      }
      
      lastUpdate.current = response.data.timestamp || Date.now()
      setConnectionStatus('Connected (Polling)')
      retryCount.current = 0
    } catch (error) {
      console.error('Polling error:', error)
      setConnectionStatus('Error')
      handleError()
    } finally {
      isPolling.current = false
    }
  }

  // Handle real-time updates
  const handleRealTimeUpdate = (data) => {
    if (data.type === 'feed_update' && data.posts) {
      const newPosts = data.posts
      
      if (newPosts.length > 0) {
        // Count truly new posts
        const reallyNewPosts = newPosts.filter(newPost => 
          !posts.some(existingPost => existingPost.id === newPost.id)
        )
        
        if (reallyNewPosts.length > 0) {
          setNewPostsAvailable(prev => prev + reallyNewPosts.length)
          
          // Show browser notification if enabled
          if (enableNotifications && 'Notification' in window && Notification.permission === 'granted') {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
            const otherUserPosts = reallyNewPosts.filter(post => post.user.id !== currentUser.id)
            
            if (otherUserPosts.length > 0) {
              new Notification(`${otherUserPosts.length} new post${otherUserPosts.length > 1 ? 's' : ''}`, {
                body: `New content from ${otherUserPosts[0].user.username}${otherUserPosts.length > 1 ? ' and others' : ''}`,
                icon: '/favicon.ico'
              })
            }
          }
        }
        
        // Update posts state
        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts]
          
          newPosts.forEach(newPost => {
            const existingIndex = updatedPosts.findIndex(p => p.id === newPost.id)
            if (existingIndex !== -1) {
              updatedPosts[existingIndex] = newPost
            } else {
              updatedPosts.unshift({ ...newPost, isNew: true })
            }
          })
          
          return updatedPosts.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          )
        })
      }
    }
  }

  // Handle errors with exponential backoff
  const handleError = () => {
    retryCount.current++
    
    if (retryCount.current >= maxRetries) {
      setConnectionStatus('Disconnected')
      cleanup()
      
      // Retry after longer delay
      setTimeout(() => {
        retryCount.current = 0
        if (method === 'sse') {
          setupSSE()
        } else {
          startPolling()
        }
      }, 10000)
    } else {
      // Exponential backoff
      setTimeout(() => {
        if (method === 'sse') {
          cleanup()
          setupSSE()
        } else {
          startPolling()
        }
      }, 2000 * retryCount.current)
    }
  }

  // Cleanup function
  const cleanup = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }

  // Manual refresh
  const refresh = async () => {
    setLoading(true)
    setNewPostsAvailable(0)
    await fetchInitialPosts()
  }

  // Load new posts
  const loadNewPosts = () => {
    setNewPostsAvailable(0)
    // Remove the 'isNew' flag from posts
    setPosts(prevPosts => 
      prevPosts.map(post => ({ ...post, isNew: false }))
    )
  }

  // Reconnect manually
  const reconnect = () => {
    setConnectionStatus('Connecting...')
    retryCount.current = 0
    cleanup()
    
    if (method === 'sse') {
      setupSSE()
    } else {
      startPolling()
    }
  }

  // Optimistic post update
  const updatePost = (postId, updates) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    )
  }

  // Add new post optimistically
  const addPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts])
  }

  // Remove post
  const removePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  return {
    // State
    posts,
    loading,
    connectionStatus,
    newPostsAvailable,
    
    // Actions
    refresh,
    loadNewPosts,
    reconnect,
    updatePost,
    addPost,
    removePost,
    requestNotificationPermission,
    
    // Utilities
    setPosts,
    isConnected: connectionStatus.includes('Connected')
  }
}

export default useRealTimeUpdates
