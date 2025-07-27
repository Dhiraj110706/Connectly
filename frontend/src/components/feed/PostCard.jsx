import React, { useState } from 'react'

const PostCard = ({ post, onLike, onComment }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const handleComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      onComment(post.id, newComment)
      setNewComment('')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{post.user.avatar}</span>
        <div>
          <h3 className="font-semibold text-gray-800">@{post.user.username}</h3>
          <p className="text-gray-500 text-sm">{formatDate(post.created_at)}</p>
        </div>
      </div>

      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {post.image && (
        <div className="text-4xl text-center mb-4 p-4 bg-gray-50 rounded-lg">
          {post.image}
        </div>
      )}

      <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-2 transition-colors ${
            post.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <span>{post.is_liked ? '❤️' : '🤍'}</span>
          <span>{post.likes_count}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <span>💬</span>
          <span>{post.comments.length}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
          <span>🔄</span>
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                Post
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex space-x-3">
                <span className="text-lg">{comment.user.avatar}</span>
                <div className="bg-gray-50 rounded-lg p-3 flex-1">
                  <h4 className="font-medium text-gray-800">@{comment.user.username}</h4>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard