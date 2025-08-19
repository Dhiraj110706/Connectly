// import React, { useState, useEffect } from 'react'
// import { useAuth } from '../../contexts/AuthContext'
// import axios from 'axios'
// import PostCard from '../feed/PostCard'

// const Profile = () => {
//   const { user } = useAuth()
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (user) {
//       fetchUserPosts()
//     }
//   }, [user])

//   const fetchUserPosts = async () => {
//     try {
//       const response = await axios.get(`/api/posts/user/${user.id}/`)
//       setPosts(response.data)
//     } catch (error) {
//       console.error('Error fetching user posts:', error)
//     } finally {
//       setLoading(false)
//     }
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
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="card mb-8">
//         <div className="flex items-center space-x-6 mb-6">
//           <div className="text-6xl">{user.avatar}</div>
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-gray-800">@{user.username}</h1>
//             <p className="text-gray-600">{user.email}</p>
//             <div className="flex space-x-6 mt-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
//                 <div className="text-gray-600">Posts</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{user.followers_count}</div>
//                 <div className="text-gray-600">Followers</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{user.following_count}</div>
//                 <div className="text-gray-600">Following</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>
//         {posts.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No posts yet</p>
//             <p className="text-gray-400">Share your first post!</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {posts.map(post => (
//               <PostCard
//                 key={post.id}
//                 post={post}
//                 onLike={handleLike}
//                 onComment={handleComment}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default Profile
// import React, { useState, useEffect } from 'react'
// import { useAuth } from '../../contexts/AuthContext'
// import axios from 'axios'
// import PostCard from '../feed/PostCard'

// const Profile = () => {
//   const { user } = useAuth()
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [modalType, setModalType] = useState('') // 'followers' or 'following'
//   const [modalUsers, setModalUsers] = useState([])
//   const [modalLoading, setModalLoading] = useState(false)
//   const [currentUser, setCurrentUser] = useState(user) // Local state for user data

//   useEffect(() => {
//     if (user) {
//       fetchUserPosts()
//       fetchCurrentUserProfile() // Fetch fresh user data
//     }
//   }, [user])

//   const fetchCurrentUserProfile = async () => {
//     try {
//       // Try different possible URL patterns
//       let response;
//       try {
//         response = await axios.get('/api/accounts/profile/')
//       } catch (error) {
//         if (error.response?.status === 404) {
//           // Try alternative URL pattern
//           response = await axios.get('/accounts/profile/')
//         } else {
//           throw error;
//         }
//       }
//       setCurrentUser(response.data)
//     } catch (error) {
//       console.error('Error fetching current user profile:', error)
//       console.log('Using fallback user data from auth context')
//       setCurrentUser(user) // Fallback to auth context user
//     }
//   }

//   const fetchUserPosts = async () => {
//     try {
//       const response = await axios.get(`/api/posts/user/${user.id}/`)
//       setPosts(response.data)
//     } catch (error) {
//       console.error('Error fetching user posts:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchFollowers = async () => {
//     setModalLoading(true)
//     try {
//       console.log('Fetching followers for user ID:', currentUser.id) // Debug log
//       let response;
//       try {
//         response = await axios.get(`/api/accounts/users/${currentUser.id}/followers/`)
//       } catch (error) {
//         if (error.response?.status === 404) {
//           // Try alternative URL pattern
//           response = await axios.get(`/accounts/users/${currentUser.id}/followers/`)
//         } else {
//           throw error;
//         }
//       }
//       console.log('Followers response:', response.data) // Debug log
//       setModalUsers(response.data)
//     } catch (error) {
//       console.error('Error fetching followers:', error)
//       setModalUsers([])
//     } finally {
//       setModalLoading(false)
//     }
//   }

//   const fetchFollowing = async () => {
//     setModalLoading(true)
//     try {
//       console.log('Fetching following for user ID:', currentUser.id) // Debug log
//       let response;
//       try {
//         response = await axios.get(`/api/auth/users/${currentUser.id}/following/`)
//       } catch (error) {
//         if (error.response?.status === 404) {
//           // Try alternative URL pattern
//           response = await axios.get(`/auth/users/${currentUser.id}/following/`)
//         } else {
//           throw error;
//         }
//       }
//       console.log('Following response:', response.data) // Debug log
//       setModalUsers(response.data)
//     } catch (error) {
//       console.error('Error fetching following:', error)
//       setModalUsers([])
//     } finally {
//       setModalLoading(false)
//     }
//   }

//   const openModal = (type) => {
//     setModalType(type)
//     setShowModal(true)
//     setModalUsers([])
    
//     if (type === 'followers') {
//       fetchFollowers()
//     } else if (type === 'following') {
//       fetchFollowing()
//     }
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setModalType('')
//     setModalUsers([])
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
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="card mb-8">
//         <div className="flex items-center space-x-6 mb-6">
//           <div className="text-6xl">{currentUser?.avatar || '👤'}</div>
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-gray-800">@{currentUser?.username}</h1>
//             <p className="text-gray-600">{currentUser?.email}</p>
//             <div className="flex space-x-6 mt-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
//                 <div className="text-gray-600">Posts</div>
//               </div>
//               <div 
//                 className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
//                 onClick={() => openModal('followers')}
//               >
//                 <div className="text-2xl font-bold text-blue-600">
//                   {currentUser?.followers_count || 0}
//                 </div>
//                 <div className="text-gray-600">Followers</div>
//               </div>
//               <div 
//                 className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
//                 onClick={() => openModal('following')}
//               >
//                 <div className="text-2xl font-bold text-blue-600">
//                   {currentUser?.following_count || 0}
//                 </div>
//                 <div className="text-gray-600">Following</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>
//         {posts.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No posts yet</p>
//             <p className="text-gray-400">Share your first post!</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {posts.map(post => (
//               <PostCard
//                 key={post.id}
//                 post={post}
//                 onLike={handleLike}
//                 onComment={handleComment}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-96 flex flex-col">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b">
//               <h3 className="text-lg font-semibold text-gray-900 capitalize">
//                 {modalType}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {modalLoading ? (
//                 <div className="flex justify-center items-center h-32">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//               ) : modalUsers.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">
//                     No {modalType} yet
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {modalUsers.map(modalUser => (
//                     <div key={modalUser.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
//                       <div className="text-2xl">{modalUser.avatar}</div>
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-900">@{modalUser.username}</div>
//                         <div className="text-sm text-gray-500">{modalUser.email}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Profile

// import React, { useState, useEffect } from 'react'
// import { useAuth } from '../../contexts/AuthContext'
// import axios from 'axios'
// import PostCard from '../feed/PostCard'

// const Profile = () => {
//   const { user } = useAuth()
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [modalType, setModalType] = useState('') // 'followers' or 'following'
//   const [modalUsers, setModalUsers] = useState([])
//   const [modalLoading, setModalLoading] = useState(false)

//   useEffect(() => {
//     if (user) {
//       fetchUserPosts()
//     }
//   }, [user])

//   const fetchUserPosts = async () => {
//     try {
//       const response = await axios.get(`/api/posts/user/${user.id}/`)
//       setPosts(response.data)
//     } catch (error) {
//       console.error('Error fetching user posts:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchFollowers = async () => {
//     setModalLoading(true)
//     try {
//       console.log('Fetching followers for user ID:', user.id)
      
//       // Use the correct URL pattern from your main urls.py
//       const response = await axios.get(`/api/auth/users/${user.id}/followers/`)
      
//       console.log('Followers response:', response.data)
//       setModalUsers(response.data)
//     } catch (error) {
//       console.error('Error fetching followers:', error)
//       console.error('Full error:', error.response)
//       setModalUsers([])
//     } finally {
//       setModalLoading(false)
//     }
//   }

//   const fetchFollowing = async () => {
//     setModalLoading(true)
//     try {
//       console.log('Fetching following for user ID:', user.id)
      
//       // Use the correct URL pattern from your main urls.py
//       const response = await axios.get(`/api/auth/users/${user.id}/following/`)
      
//       console.log('Following response:', response.data)
//       setModalUsers(response.data)
//     } catch (error) {
//       console.error('Error fetching following:', error)
//       console.error('Full error:', error.response)
//       setModalUsers([])
//     } finally {
//       setModalLoading(false)
//     }
//   }

//   const openModal = (type) => {
//     setModalType(type)
//     setShowModal(true)
//     setModalUsers([])
    
//     if (type === 'followers') {
//       fetchFollowers()
//     } else if (type === 'following') {
//       fetchFollowing()
//     }
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setModalType('')
//     setModalUsers([])
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
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <div className="card mb-8">
//         <div className="flex items-center space-x-6 mb-6">
//           <div className="text-6xl">{user?.avatar || '👤'}</div>
//           <div className="flex-1">
//             <h1 className="text-3xl font-bold text-gray-800">@{user?.username}</h1>
//             <p className="text-gray-600">{user?.email}</p>
//             <div className="flex space-x-6 mt-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
//                 <div className="text-gray-600">Posts</div>
//               </div>
//               <div 
//                 className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
//                 onClick={() => openModal('followers')}
//               >
//                 <div className="text-2xl font-bold text-blue-600">
//                   {user?.followers_count || 0}
//                 </div>
//                 <div className="text-gray-600">Followers</div>
//               </div>
//               <div 
//                 className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
//                 onClick={() => openModal('following')}
//               >
//                 <div className="text-2xl font-bold text-blue-600">
//                   {user?.following_count || 0}
//                 </div>
//                 <div className="text-gray-600">Following</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>
//         {posts.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No posts yet</p>
//             <p className="text-gray-400">Share your first post!</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {posts.map(post => (
//               <PostCard
//                 key={post.id}
//                 post={post}
//                 onLike={handleLike}
//                 onComment={handleComment}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-96 flex flex-col">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b">
//               <h3 className="text-lg font-semibold text-gray-900 capitalize">
//                 {modalType}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {modalLoading ? (
//                 <div className="flex justify-center items-center h-32">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 </div>
//               ) : modalUsers.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">
//                     No {modalType} yet
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {modalUsers.map(modalUser => (
//                     <div key={modalUser.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
//                       <div className="text-2xl">{modalUser.avatar || '👤'}</div>
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-900">@{modalUser.username}</div>
//                         <div className="text-sm text-gray-500">{modalUser.email}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Profile

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import PostCard from "../feed/PostCard";

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalUsers, setModalUsers] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`/api/posts/user/${user.id}/`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    setModalLoading(true);
    try {
      const res = await axios.get(`/api/auth/users/${user.id}/followers/`);
      setModalUsers(res.data);
    } catch (err) {
      console.error(err);
      setModalUsers([]);
    } finally {
      setModalLoading(false);
    }
  };

  const fetchFollowing = async () => {
    setModalLoading(true);
    try {
      const res = await axios.get(`/api/auth/users/${user.id}/following/`);
      setModalUsers(res.data);
    } catch (err) {
      console.error(err);
      setModalUsers([]);
    } finally {
      setModalLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setModalUsers([]);
    type === "followers" ? fetchFollowers() : fetchFollowing();
  };

  const closeModal = () => {
    setShowModal(false);
    setModalUsers([]);
    setModalType("");
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like/`);
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, is_liked: res.data.is_liked, likes_count: res.data.likes_count }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking:", err);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/comment/`, { content });
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, res.data] } : p
        )
      );
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 flex items-center gap-6 text-white">
        <div className="text-6xl">{user?.avatar || "👤"}</div>
        <div>
          <h1 className="text-3xl font-bold">@{user?.username}</h1>
          <p className="opacity-90">{user?.email}</p>
          <div className="flex gap-8 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-sm opacity-80">Posts</p>
            </div>
            <div
              onClick={() => openModal("followers")}
              className="text-center cursor-pointer hover:scale-105 transition"
            >
              <p className="text-2xl font-bold">{user?.followers_count || 0}</p>
              <p className="text-sm opacity-80">Followers</p>
            </div>
            <div
              onClick={() => openModal("following")}
              className="text-center cursor-pointer hover:scale-105 transition"
            >
              <p className="text-2xl font-bold">{user?.following_count || 0}</p>
              <p className="text-sm opacity-80">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No posts yet</p>
            <p className="text-gray-400">Share your first post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold capitalize">{modalType}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scroll">
              {modalLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : modalUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No {modalType} yet
                </div>
              ) : (
                <div className="space-y-3">
                  {modalUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl">{u.avatar || "👤"}</div>
                      <div>
                        <p className="font-medium">@{u.username}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
