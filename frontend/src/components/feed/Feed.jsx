// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import PostCard from './PostCard'
// import CreatePost from './CreatePost'

// const Feed = () => {
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchPosts()
//   }, [])

//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get('/api/posts/')
//       setPosts(response.data)
//     } catch (error) {
//       console.error('Error fetching posts:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePostCreated = (newPost) => {
//     setPosts([newPost, ...posts])
//   }

//   const handleLike = async (postId) => {
//     try {
//       const response = await axios.post(`/api/posts/${postId}/like/`)
//       setPosts(posts.map(post => 
//         post.id === postId 
//           ? { ...post, is_liked: response.data.is_liked, likes_count: response.data.likes_count }
//           : post
//       ))
//     } catch (error) {
//       console.error('Error liking post:', error)
//     }
//   }

//   const handleComment = async (postId, content) => {
//     try {
//       const response = await axios.post(`/api/posts/${postId}/comment/`, { content })
//       setPosts(posts.map(post => 
//         post.id === postId 
//           ? { ...post, comments: [...post.comments, response.data] }
//           : post
//       ))
//     } catch (error) {
//       console.error('Error adding comment:', error)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <CreatePost onPostCreated={handlePostCreated} />
//       <div className="space-y-6">
//         {posts.map(post => (
//           <PostCard
//             key={post.id}
//             post={post}
//             onLike={handleLike}
//             onComment={handleComment}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }

// export default Feed
// // import React, { useState, useEffect, useCallback } from 'react'
// // import axios from 'axios'
// // import PostCard from './PostCard'
// // import CreatePost from './CreatePost'
// // import useWebSocket from '../../hooks/useWebSocket'
// // import notifications from '../../utils/notifications'

// // const Feed = () => {
// //   const [posts, setPosts] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [connectionStatus, setConnectionStatus] = useState('Connecting...')

// //   useEffect(() => {
// //     fetchPosts()
// //   }, [])

// //   const fetchPosts = async () => {
// //     try {
// //       const response = await axios.get('/api/posts/')
// //       setPosts(response.data)
// //     } catch (error) {
// //       console.error('Error fetching posts:', error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   // WebSocket message handler
// //   const handleWebSocketMessage = useCallback((data) => {
// //     console.log('WebSocket message received:', data)
    
// //     switch (data.type) {
// //       case 'post_created':
// //         // Add new post to the beginning of the list
// //         setPosts(prevPosts => {
// //           // Add animation class to new post
// //           const newPost = { ...data.post, isNew: true }
// //           return [newPost, ...prevPosts]
// //         })
        
// //         // Show notification if it's not from current user
// //         const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
// //         if (data.post.user.id !== currentUser.id) {
// //           notifications.newPost(data.post.user.username)
// //         }
// //         break
        
// //       case 'post_updated':
// //         // Update specific post (likes, etc.)
// //         setPosts(prevPosts => 
// //           prevPosts.map(post => 
// //             post.id === data.post_id 
// //               ? { ...post, ...data.updates }
// //               : post
// //           )
// //         )
// //         break
        
// //       case 'comment_added':
// //         // Add new comment to specific post
// //         setPosts(prevPosts => 
// //           prevPosts.map(post => 
// //             post.id === data.post_id 
// //               ? { ...post, comments: [...post.comments, data.comment] }
// //               : post
// //           )
// //         )
// //         break
        
// //       case 'post_deleted':
// //         // Remove deleted post
// //         setPosts(prevPosts => 
// //           prevPosts.filter(post => post.id !== data.post_id)
// //         )
        
// //         notifications.postDeleted()
// //         break
        
// //       default:
// //         console.log('Unknown WebSocket message type:', data.type)
// //     }
// //   }, [])

// //   // WebSocket connection handlers
// //   const handleWebSocketOpen = useCallback(() => {
// //     console.log('Feed WebSocket connected')
// //     setConnectionStatus('Connected')
// //     notifications.connectionStatus('connected')
// //   }, [])

// //   const handleWebSocketClose = useCallback(() => {
// //     console.log('Feed WebSocket disconnected')
// //     setConnectionStatus('Disconnected')
// //     notifications.connectionStatus('disconnected')
// //   }, [])

// //   const handleWebSocketError = useCallback((error) => {
// //     console.error('Feed WebSocket error:', error)
// //     setConnectionStatus('Error')
// //     notifications.connectionStatus('error')
// //   }, [])

// //   // Initialize WebSocket connection
// //   const { sendMessage, disconnect } = useWebSocket('/ws/feed/', {
// //     onMessage: handleWebSocketMessage,
// //     onOpen: handleWebSocketOpen,
// //     onClose: handleWebSocketClose,
// //     onError: handleWebSocketError,
// //     reconnectAttempts: 5,
// //     reconnectInterval: 3000
// //   })

// //   // Utility function to show notifications
// //   const showNotification = (message, type = 'info') => {
// //     notifications.show(message, type)
// //   }

// //   const handlePostCreated = (newPost) => {
// //     // Note: We don't need to manually add the post here anymore
// //     // The WebSocket will handle it automatically
// //     console.log('Post created:', newPost)
// //   }

// //   const handleLike = async (postId) => {
// //     try {
// //       // Optimistic update
// //       setPosts(prevPosts => 
// //         prevPosts.map(post => {
// //           if (post.id === postId) {
// //             return {
// //               ...post,
// //               is_liked: !post.is_liked,
// //               likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
// //             }
// //           }
// //           return post
// //         })
// //       )

// //       // Make API call (WebSocket will also update this)
// //       await axios.post(`/api/posts/${postId}/like/`)
// //     } catch (error) {
// //       console.error('Error liking post:', error)
// //       // Revert optimistic update on error
// //       fetchPosts()
// //       notifications.error('Failed to update like')
// //     }
// //   }

// //   const handleComment = async (postId, content) => {
// //     try {
// //       // Make API call (WebSocket will handle the update)
// //       await axios.post(`/api/posts/${postId}/comment/`, { content })
// //     } catch (error) {
// //       console.error('Error adding comment:', error)
// //       notifications.error('Failed to add comment')
// //     }
// //   }

// //   const handleDeletePost = async (postId) => {
// //     if (!window.confirm('Are you sure you want to delete this post?')) {
// //       return
// //     }

// //     try {
// //       await axios.delete(`/api/posts/${postId}/delete/`)
// //       // WebSocket will handle the removal
// //     } catch (error) {
// //       console.error('Error deleting post:', error)
// //       notifications.error('Failed to delete post')
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading feed...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="max-w-2xl mx-auto px-4 py-8">
// //       {/* Connection status indicator */}
// //       <div className="mb-4">
// //         <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
// //           connectionStatus === 'Connected' ? 'bg-green-100 text-green-800' :
// //           connectionStatus === 'Connecting...' ? 'bg-yellow-100 text-yellow-800' :
// //           'bg-red-100 text-red-800'
// //         }`}>
// //           <div className={`w-2 h-2 rounded-full mr-2 ${
// //             connectionStatus === 'Connected' ? 'bg-green-500' :
// //             connectionStatus === 'Connecting...' ? 'bg-yellow-500' :
// //             'bg-red-500'
// //           }`}></div>
// //           {connectionStatus}
// //         </div>
// //       </div>

// //       <CreatePost onPostCreated={handlePostCreated} />
      
// //       <div className="space-y-6">
// //         {posts.length === 0 ? (
// //           <div className="text-center py-12">
// //             <div className="text-6xl mb-4">📝</div>
// //             <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
// //             <p className="text-gray-500">Be the first to share something!</p>
// //           </div>
// //         ) : (
// //           posts.map(post => (
// //             <PostCard
// //               key={post.id}
// //               post={post}
// //               onLike={handleLike}
// //               onComment={handleComment}
// //               onDelete={handleDeletePost}
// //               className={post.isNew ? 'animate-slide-in' : ''}
// //             />
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default Feed

// import React, { useState, useEffect, useCallback, useRef } from 'react'
// import axios from 'axios'
// import PostCard from './PostCard'
// import CreatePost from './CreatePost'

// const Feed = () => {
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [lastSync, setLastSync] = useState(Date.now())
//   const syncInterval = useRef(null)

//   useEffect(() => {
//     fetchPosts()
//     startBackgroundSync()
    
//     // Focus/blur events for better UX
//     const handleFocus = () => syncWithServer()
//     const handleVisibilityChange = () => {
//       if (!document.hidden) {
//         syncWithServer()
//       }
//     }
    
//     window.addEventListener('focus', handleFocus)
//     document.addEventListener('visibilitychange', handleVisibilityChange)
    
//     return () => {
//       stopBackgroundSync()
//       window.removeEventListener('focus', handleFocus)
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//     }
//   }, [])

//   // Initial fetch
//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get('/api/posts/')
//       setPosts(response.data)
//       setLastSync(Date.now())
//     } catch (error) {
//       console.error('Error fetching posts:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Background sync every 30 seconds
//   const startBackgroundSync = () => {
//     if (syncInterval.current) return
    
//     syncInterval.current = setInterval(() => {
//       syncWithServer()
//     }, 30000) // Sync every 30 seconds
//   }

//   const stopBackgroundSync = () => {
//     if (syncInterval.current) {
//       clearInterval(syncInterval.current)
//       syncInterval.current = null
//     }
//   }

//   // Sync with server
//   const syncWithServer = async () => {
//     try {
//       const response = await axios.get(`/api/posts/?since=${lastSync}`)
//       const serverPosts = response.data
      
//       if (serverPosts.length > 0) {
//         setPosts(prevPosts => {
//           // Merge server posts with local posts
//           const mergedPosts = [...prevPosts]
          
//           serverPosts.forEach(serverPost => {
//             const existingIndex = mergedPosts.findIndex(p => p.id === serverPost.id)
//             if (existingIndex !== -1) {
//               // Update existing post with server data
//               mergedPosts[existingIndex] = serverPost
//             } else {
//               // Add new post
//               mergedPosts.unshift(serverPost)
//             }
//           })
          
//           // Sort by creation date
//           return mergedPosts.sort((a, b) => 
//             new Date(b.created_at) - new Date(a.created_at)
//           )
//         })
//       }
      
//       setLastSync(Date.now())
//     } catch (error) {
//       console.error('Sync error:', error)
//     }
//   }

//   // Handle new post with immediate UI update
//   const handlePostCreated = (newPost) => {
//     // Immediately add to feed
//     setPosts(prevPosts => [newPost, ...prevPosts])
    
//     // Trigger sync to get any other new posts
//     setTimeout(syncWithServer, 1000)
//   }

//   // Handle like with optimistic update
//   const handleLike = async (postId) => {
//     // Find the post to update
//     const postToUpdate = posts.find(p => p.id === postId)
//     if (!postToUpdate) return

//     // Optimistic update
//     const optimisticUpdate = {
//       is_liked: !postToUpdate.is_liked,
//       likes_count: postToUpdate.is_liked 
//         ? postToUpdate.likes_count - 1 
//         : postToUpdate.likes_count + 1
//     }

//     setPosts(prevPosts => 
//       prevPosts.map(post => 
//         post.id === postId 
//           ? { ...post, ...optimisticUpdate }
//           : post
//       )
//     )

//     try {
//       // Send to server
//       const response = await axios.post(`/api/posts/${postId}/like/`)
      
//       // Update with server response (in case of discrepancy)
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post.id === postId 
//             ? { 
//                 ...post, 
//                 is_liked: response.data.is_liked, 
//                 likes_count: response.data.likes_count 
//               }
//             : post
//         )
//       )
//     } catch (error) {
//       console.error('Error liking post:', error)
      
//       // Revert optimistic update on error
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post.id === postId 
//             ? { 
//                 ...post, 
//                 is_liked: postToUpdate.is_liked, 
//                 likes_count: postToUpdate.likes_count 
//               }
//             : post
//         )
//       )
      
//       showNotification('Failed to update like. Please try again.', 'error')
//     }
//   }

//   // Handle comment with optimistic update
//   const handleComment = async (postId, content) => {
//     const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    
//     // Create optimistic comment
//     const optimisticComment = {
//       id: `temp-${Date.now()}`, // Temporary ID
//       user: currentUser,
//       content,
//       created_at: new Date().toISOString()
//     }

//     // Add comment optimistically
//     setPosts(prevPosts => 
//       prevPosts.map(post => 
//         post.id === postId 
//           ? { ...post, comments: [...post.comments, optimisticComment] }
//           : post
//       )
//     )

//     try {
//       const response = await axios.post(`/api/posts/${postId}/comment/`, { content })
      
//       // Replace optimistic comment with server response
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post.id === postId 
//             ? { 
//                 ...post, 
//                 comments: post.comments.map(comment => 
//                   comment.id === optimisticComment.id 
//                     ? response.data 
//                     : comment
//                 )
//               }
//             : post
//         )
//       )
//     } catch (error) {
//       console.error('Error adding comment:', error)
      
//       // Remove optimistic comment on error
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post.id === postId 
//             ? { 
//                 ...post, 
//                 comments: post.comments.filter(comment => 
//                   comment.id !== optimisticComment.id
//                 )
//               }
//             : post
//         )
//       )
      
//       showNotification('Failed to add comment. Please try again.', 'error')
//       throw error
//     }
//   }

//   // Handle post deletion
//   const handleDeletePost = async (postId) => {
//     if (!window.confirm('Are you sure you want to delete this post?')) {
//       return
//     }

//     // Store post for potential restoration
//     const postToDelete = posts.find(p => p.id === postId)
    
//     // Optimistically remove from UI
//     setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))

//     try {
//       await axios.delete(`/api/posts/${postId}/delete/`)
//       showNotification('Post deleted successfully', 'success')
//     } catch (error) {
//       console.error('Error deleting post:', error)
      
//       // Restore post on error
//       if (postToDelete) {
//         setPosts(prevPosts => {
//           const restored = [...prevPosts, postToDelete]
//           return restored.sort((a, b) => 
//             new Date(b.created_at) - new Date(a.created_at)
//           )
//         })
//       }
      
//       showNotification('Failed to delete post. Please try again.', 'error')
//     }
//   }

//   // Refresh feed manually
//   const refreshFeed = async () => {
//     setLoading(true)
//     await fetchPosts()
//     showNotification('Feed refreshed', 'success')
//   }

//   // Show notification
//   const showNotification = (message, type = 'info') => {
//     const notification = document.createElement('div')
//     notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ${
//       type === 'success' ? 'bg-green-500 text-white' :
//       type === 'error' ? 'bg-red-500 text-white' :
//       'bg-blue-500 text-white'
//     }`
//     notification.textContent = message
//     document.body.appendChild(notification)
    
//     // Animate in
//     setTimeout(() => notification.style.transform = 'translateX(0)', 10)
    
//     // Remove after delay
//     setTimeout(() => {
//       notification.style.opacity = '0'
//       notification.style.transform = 'translateX(100%)'
//       setTimeout(() => {
//         if (document.body.contains(notification)) {
//           document.body.removeChild(notification)
//         }
//       }, 300)
//     }, 3000)
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading feed...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       {/* Header with refresh button */}
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//           <span className="mr-2">🏠</span>
//           Feed
//         </h1>
        
//         <div className="flex items-center space-x-2">
//           <div className="text-xs text-gray-500">
//             Last synced: {new Date(lastSync).toLocaleTimeString()}
//           </div>
//           <button
//             onClick={refreshFeed}
//             className="flex items-center space-x-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
//           >
//             <span>🔄</span>
//             <span>Refresh</span>
//           </button>
//         </div>
//       </div>

//       <CreatePost onPostCreated={handlePostCreated} />
      
//       <div className="space-y-6">
//         {posts.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📝</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
//             <p className="text-gray-500 mb-4">Be the first to share something!</p>
//             <button
//               onClick={refreshFeed}
//               className="btn-primary"
//             >
//               Check for posts
//             </button>
//           </div>
//         ) : (
//           posts.map(post => (
//             <PostCard
//               key={post.id}
//               post={post}
//               onLike={handleLike}
//               onComment={handleComment}
//               onDelete={handleDeletePost}
//             />
//           ))
//         )}
//       </div>
      
//       {/* Background sync indicator */}
//       <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
//         Auto-sync: ON
//       </div>
//     </div>
//   )
// }

// export default Feed

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
  const syncInterval = useRef(null)
  const notificationTimeout = useRef(null)

  useEffect(() => {
    fetchPosts()
    startBackgroundSync()
    
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
      setPosts(response.data)
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
      
      if (serverPosts.length > 0) {
        setPosts(prevPosts => {
          // Merge server posts with local posts
          const mergedPosts = [...prevPosts]
          
          serverPosts.forEach(serverPost => {
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
        
        if (serverPosts.length > 0) {
          // showNotification(`${serverPosts.length} new post${serverPosts.length > 1 ? 's' : ''} loaded`, 'success')
        }
      }
      
      setLastSync(Date.now())
    } catch (error) {
      console.error('Sync error:', error)
    }
  }

  // Handle new post with immediate UI update
  const handlePostCreated = (newPost) => {
    // Immediately add to feed with animation
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
    await fetchPosts()
    showNotification('Feed refreshed', 'success')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      </div>
    )
  }

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
        className="mb-6 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 bg-indigo-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          </span>
          Your Feed
        </h1>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
            Synced: {new Date(lastSync).toLocaleTimeString()}
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
      </motion.div>

      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-6 mt-6">
        {posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your feed is empty</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">When you follow people, you'll see their posts here. Start by creating your own post!</p>
            <div className="bg-indigo-50 p-4 rounded-xl inline-flex items-center">
              <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm text-indigo-600">Posts from people you follow will appear here</span>
            </div>
          </motion.div>
        ) : (
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
        )}
      </div>
      
      {/* Background sync indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white px-3 py-2 rounded-xl shadow border border-gray-200 flex items-center"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
        <span>Auto-sync enabled</span>
      </motion.div>
    </div>
  )
}

export default Feed