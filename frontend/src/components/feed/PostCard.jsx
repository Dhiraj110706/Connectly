import React, { useState } from 'react'

const PostCard = ({ post, onLike, onComment, onDelete, className = '' }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [imageError, setImageError] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || commentLoading) return

    setCommentLoading(true)
    try {
      await onComment(post.id, newComment)
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
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

  const renderMedia = () => {
    const hasImage = post.has_image && post.image_url && !imageError
    const hasEmoji = post.has_emoji && post.emoji

    if (!hasImage && !hasEmoji) return null

    return (
      <div className="mb-4">
        {/* Render uploaded image */}
        {hasImage && (
          <div className="mb-3">
            <img
              src={post.image_url}
              alt="Post image"
              className="w-full max-w-lg mx-auto rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onError={handleImageError}
              loading="lazy"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              onClick={() => window.open(post.image_url, '_blank')}
            />
          </div>
        )}
        
        {/* Render emoji/text decoration */}
        {hasEmoji && (
          <div className="text-center">
            <div className="inline-block text-4xl p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-100 shadow-sm">
              {post.emoji}
            </div>
          </div>
        )}
        
        {/* Show error message if image failed to load */}
        {post.has_image && imageError && (
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-red-600 text-sm">❌ Failed to load image</span>
            <div className="text-xs text-gray-500 mt-1">
              The image may have been deleted or is temporarily unavailable
            </div>
          </div>
        )}
      </div>
    )
  }

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isOwner = currentUser.id === post.user.id

  return (
    <div className={`card ${className}`}>
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{post.user.avatar}</span>
          <div>
            <h3 className="font-semibold text-gray-800">@{post.user.username}</h3>
            <p className="text-gray-500 text-sm">{formatDate(post.created_at)}</p>
          </div>
        </div>
        
        {/* Delete button for post owner */}
        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
            title="Delete post"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      
      {/* Media Content */}
      {(post.has_image || post.has_emoji) && renderMedia()}

      {/* Action Buttons */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${
            post.is_liked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <span className="text-lg">{post.is_liked ? '❤️' : '🤍'}</span>
          <span className="font-medium">{post.likes_count}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-all duration-200 hover:scale-105"
        >
          <span className="text-lg">💬</span>
          <span className="font-medium">{post.comments.length}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-all duration-200 hover:scale-105">
          <span className="text-lg">🔄</span>
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-3">
              <span className="text-lg mt-1">{currentUser.avatar || '👤'}</span>
              <div className="flex-1 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="2"
                  maxLength="500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {newComment.length}/500 characters
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || commentLoading}
                    className="btn-primary disabled:opacity-50 flex items-center space-x-2"
                  >
                    {commentLoading && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    )}
                    <span>{commentLoading ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {post.comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <span className="text-2xl block mb-2">💭</span>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              post.comments.map(comment => (
                <div key={comment.id} className="flex space-x-3 group">
                  <span className="text-lg mt-1">{comment.user.avatar}</span>
                  <div className="bg-gray-50 rounded-lg p-3 flex-1 group-hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800">@{comment.user.username}</h4>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard