import React, { useState, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [emoji, setEmoji] = useState('')
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const popularEmojis = ['😊', '😂', '❤️', '🔥', '👍', '🎉', '🙏', '👏', '🤔', '😍']

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size cannot exceed 5MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WebP images are allowed')
        return
      }

      setSelectedImage(file)
      setError('')

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() && !selectedImage) {
      setError('Please add some content or an image')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('content', content)
      if (emoji.trim()) {
        formData.append('emoji', emoji.trim())
      }
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await axios.post('/api/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      onPostCreated(response.data)
      setContent('')
      setEmoji('')
      setSelectedImage(null)
      setImagePreview(null)
      setIsExpanded(false)
      setCharCount(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error creating post:', error)
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.image) {
          setError(errorData.image[0])
        } else if (errorData.emoji) {
          setError(errorData.emoji[0])
        } else if (errorData.content) {
          setError(errorData.content[0])
        } else {
          setError('Failed to create post. Please try again.')
        }
      } else {
        setError('Failed to create post. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleContentChange = (e) => {
    const value = e.target.value
    setContent(value)
    setCharCount(value.length)
    if (value.length > 0 && !isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleCancel = () => {
    setIsExpanded(false)
    setContent('')
    setEmoji('')
    setSelectedImage(null)
    setImagePreview(null)
    setError('')
    setCharCount(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addEmoji = (selectedEmoji) => {
    setEmoji(selectedEmoji)
    setShowEmojiPicker(false)
  }

  return (
    <motion.div 
      layout
      className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username.charAt(0).toUpperCase() : 'Y'}
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-800">Create Post</h3>
              <p className="text-xs text-gray-500">Share your thoughts with the community</p>
            </div>
          </div>

          {/* Content textarea */}
          <motion.textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onFocus={handleFocus}
            placeholder="What's on your mind?"
            className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            rows={isExpanded ? "4" : "2"}
            maxLength="500"
          />
          
          {/* Character counter */}
          <div className="text-xs text-gray-500 mt-1 text-right">
            {charCount}/500 characters
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Emoji section */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Add mood emoji</label>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      {showEmojiPicker ? 'Hide emojis' : 'Show emojis'}
                    </button>
                  </div>
                  
                  {showEmojiPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      {popularEmojis.map((emojiItem) => (
                        <button
                          key={emojiItem}
                          type="button"
                          onClick={() => addEmoji(emojiItem)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {emojiItem}
                        </button>
                      ))}
                    </motion.div>
                  )}
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="text-2xl">{emoji}</div>
                    <input
                      type="text"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      placeholder="Or type an emoji"
                      className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      maxLength="2"
                    />
                    {emoji && (
                      <button
                        type="button"
                        onClick={() => setEmoji('')}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Image upload section */}
                <div className="mt-4">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm font-medium">Add Photo</span>
                    </motion.button>
                    
                    {selectedImage && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                        <span className="truncate max-w-xs">{selectedImage.name}</span>
                        <span className="text-xs">({formatFileSize(selectedImage.size)})</span>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    📸 Supported: JPEG, PNG, GIF, WebP • Max 5MB
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Image preview */}
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-2 font-medium">Image Preview</p>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Error message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {error}
                  </motion.div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting || (!content.trim() && !selectedImage)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                        </svg>
                        <span>Post</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapsed state */}
        {!isExpanded && (
          <div className="border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(true)
                setTimeout(() => textareaRef.current?.focus(), 100)
              }}
              className="w-full text-left text-gray-500 hover:text-gray-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
              Write something...
            </button>
          </div>
        )}
      </form>
    </motion.div>
  )
}

export default CreatePost