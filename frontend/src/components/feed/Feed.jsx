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
