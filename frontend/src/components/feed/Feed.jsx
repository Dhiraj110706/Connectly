import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PostCard from './PostCard'
import CreatePost from './CreatePost'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/')
      setPosts(response.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts])
  }

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like/`)
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_liked: response.data.is_liked, likes_count: response.data.likes_count }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (postId, content) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/comment/`, { content })
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, response.data] }
          : post
      ))
    } catch (error) {
      console.error('Error adding comment:', error)
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <CreatePost onPostCreated={handlePostCreated} />
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  )
}

export default Feed
// import React, { useState, useEffect, useCallback } from 'react'
// import axios from 'axios'
// import PostCard from './PostCard'
// import CreatePost from './CreatePost'
// import useWebSocket from '../../hooks/useWebSocket'
// import notifications from '../../utils/notifications'

// const Feed = () => {
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [connectionStatus, setConnectionStatus] = useState('Connecting...')

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

//   // WebSocket message handler
//   const handleWebSocketMessage = useCallback((data) => {
//     console.log('WebSocket message received:', data)
    
//     switch (data.type) {
//       case 'post_created':
//         // Add new post to the beginning of the list
//         setPosts(prevPosts => {
//           // Add animation class to new post
//           const newPost = { ...data.post, isNew: true }
//           return [newPost, ...prevPosts]
//         })
        
//         // Show notification if it's not from current user
//         const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
//         if (data.post.user.id !== currentUser.id) {
//           notifications.newPost(data.post.user.username)
//         }
//         break
        
//       case 'post_updated':
//         // Update specific post (likes, etc.)
//         setPosts(prevPosts => 
//           prevPosts.map(post => 
//             post.id === data.post_id 
//               ? { ...post, ...data.updates }
//               : post
//           )
//         )
//         break
        
//       case 'comment_added':
//         // Add new comment to specific post
//         setPosts(prevPosts => 
//           prevPosts.map(post => 
//             post.id === data.post_id 
//               ? { ...post, comments: [...post.comments, data.comment] }
//               : post
//           )
//         )
//         break
        
//       case 'post_deleted':
//         // Remove deleted post
//         setPosts(prevPosts => 
//           prevPosts.filter(post => post.id !== data.post_id)
//         )
        
//         notifications.postDeleted()
//         break
        
//       default:
//         console.log('Unknown WebSocket message type:', data.type)
//     }
//   }, [])

//   // WebSocket connection handlers
//   const handleWebSocketOpen = useCallback(() => {
//     console.log('Feed WebSocket connected')
//     setConnectionStatus('Connected')
//     notifications.connectionStatus('connected')
//   }, [])

//   const handleWebSocketClose = useCallback(() => {
//     console.log('Feed WebSocket disconnected')
//     setConnectionStatus('Disconnected')
//     notifications.connectionStatus('disconnected')
//   }, [])

//   const handleWebSocketError = useCallback((error) => {
//     console.error('Feed WebSocket error:', error)
//     setConnectionStatus('Error')
//     notifications.connectionStatus('error')
//   }, [])

//   // Initialize WebSocket connection
//   const { sendMessage, disconnect } = useWebSocket('/ws/feed/', {
//     onMessage: handleWebSocketMessage,
//     onOpen: handleWebSocketOpen,
//     onClose: handleWebSocketClose,
//     onError: handleWebSocketError,
//     reconnectAttempts: 5,
//     reconnectInterval: 3000
//   })

//   // Utility function to show notifications
//   const showNotification = (message, type = 'info') => {
//     notifications.show(message, type)
//   }

//   const handlePostCreated = (newPost) => {
//     // Note: We don't need to manually add the post here anymore
//     // The WebSocket will handle it automatically
//     console.log('Post created:', newPost)
//   }

//   const handleLike = async (postId) => {
//     try {
//       // Optimistic update
//       setPosts(prevPosts => 
//         prevPosts.map(post => {
//           if (post.id === postId) {
//             return {
//               ...post,
//               is_liked: !post.is_liked,
//               likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
//             }
//           }
//           return post
//         })
//       )

//       // Make API call (WebSocket will also update this)
//       await axios.post(`/api/posts/${postId}/like/`)
//     } catch (error) {
//       console.error('Error liking post:', error)
//       // Revert optimistic update on error
//       fetchPosts()
//       notifications.error('Failed to update like')
//     }
//   }

//   const handleComment = async (postId, content) => {
//     try {
//       // Make API call (WebSocket will handle the update)
//       await axios.post(`/api/posts/${postId}/comment/`, { content })
//     } catch (error) {
//       console.error('Error adding comment:', error)
//       notifications.error('Failed to add comment')
//     }
//   }

//   const handleDeletePost = async (postId) => {
//     if (!window.confirm('Are you sure you want to delete this post?')) {
//       return
//     }

//     try {
//       await axios.delete(`/api/posts/${postId}/delete/`)
//       // WebSocket will handle the removal
//     } catch (error) {
//       console.error('Error deleting post:', error)
//       notifications.error('Failed to delete post')
//     }
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
//       {/* Connection status indicator */}
//       <div className="mb-4">
//         <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
//           connectionStatus === 'Connected' ? 'bg-green-100 text-green-800' :
//           connectionStatus === 'Connecting...' ? 'bg-yellow-100 text-yellow-800' :
//           'bg-red-100 text-red-800'
//         }`}>
//           <div className={`w-2 h-2 rounded-full mr-2 ${
//             connectionStatus === 'Connected' ? 'bg-green-500' :
//             connectionStatus === 'Connecting...' ? 'bg-yellow-500' :
//             'bg-red-500'
//           }`}></div>
//           {connectionStatus}
//         </div>
//       </div>

//       <CreatePost onPostCreated={handlePostCreated} />
      
//       <div className="space-y-6">
//         {posts.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📝</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
//             <p className="text-gray-500">Be the first to share something!</p>
//           </div>
//         ) : (
//           posts.map(post => (
//             <PostCard
//               key={post.id}
//               post={post}
//               onLike={handleLike}
//               onComment={handleComment}
//               onDelete={handleDeletePost}
//               className={post.isNew ? 'animate-slide-in' : ''}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default Feed

