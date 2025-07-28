// // // import React, { useState } from 'react'
// // // import axios from 'axios'

// // // const CreatePost = ({ onPostCreated }) => {
// // //   const [content, setContent] = useState('')
// // //   const [image, setImage] = useState('')
// // //   const [loading, setLoading] = useState(false)

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()
// // //     if (!content.trim()) return

// // //     setLoading(true)
// // //     try {
// // //       const response = await axios.post('/api/posts/', {
// // //         content,
// // //         image: image || null
// // //       })
// // //       onPostCreated(response.data)
// // //       setContent('')
// // //       setImage('')
// // //     } catch (error) {
// // //       console.error('Error creating post:', error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   return (
// // //     <div className="card mb-6">
// // //       <form onSubmit={handleSubmit}>
// // //         <textarea
// // //           value={content}
// // //           onChange={(e) => setContent(e.target.value)}
// // //           placeholder="What's on your mind?"
// // //           className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //           rows="3"
// // //         />
// // //         <div className="flex items-center justify-between mt-4">
// // //           <input
// // //             type="text"
// // //             value={image}
// // //             onChange={(e) => setImage(e.target.value)}
// // //             placeholder="Add an emoji or image URL"
// // //             className="flex-1 p-2 border border-gray-200 rounded-lg mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //           />
// // //           <button
// // //             type="submit"
// // //             disabled={loading || !content.trim()}
// // //             className="btn-primary disabled:opacity-50"
// // //           >
// // //             {loading ? 'Posting...' : 'Post'}
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   )
// // // }

// // // export default CreatePost
// // import React, { useState } from 'react'
// // import axios from 'axios'

// // const CreatePost = ({ onPostCreated }) => {
// //   const [content, setContent] = useState('')
// //   const [image, setImage] = useState('')
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState('')

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     if (!content.trim()) {
// //       setError('Post content is required')
// //       return
// //     }

// //     setLoading(true)
// //     setError('')
    
// //     try {
// //       const response = await axios.post('/api/posts/', {
// //         content,
// //         image: image.trim() || null
// //       })
// //       onPostCreated(response.data)
// //       setContent('')
// //       setImage('')
// //     } catch (error) {
// //       console.error('Error creating post:', error)
// //       if (error.response?.data?.image) {
// //         setError(error.response.data.image[0])
// //       } else {
// //         setError('Failed to create post. Please try again.')
// //       }
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const isValidImageUrl = (url) => {
// //     if (!url) return false
// //     try {
// //       new URL(url)
// //       return url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
// //     } catch {
// //       return false
// //     }
// //   }

// //   const getImagePreview = () => {
// //     if (!image) return null

// //     if (isValidImageUrl(image)) {
// //       return (
// //         <div className="mt-2 p-2 bg-gray-50 rounded border">
// //           <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
// //           <img
// //             src={image}
// //             alt="Preview"
// //             className="max-w-full h-32 object-cover rounded"
// //             onError={(e) => {
// //               e.target.style.display = 'none'
// //               e.target.nextSibling.style.display = 'block'
// //             }}
// //           />
// //           <div style={{ display: 'none' }} className="text-red-500 text-sm">
// //             ❌ Invalid image URL
// //           </div>
// //         </div>
// //       )
// //     } else if (image.length <= 10) {
// //       return (
// //         <div className="mt-2 p-2 bg-gray-50 rounded border">
// //           <p className="text-sm text-gray-600 mb-2">Emoji/Text Preview:</p>
// //           <div className="text-2xl text-center">{image}</div>
// //         </div>
// //       )
// //     } else {
// //       return (
// //         <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
// //           <p className="text-sm text-red-600">
// //             ⚠️ Please enter a valid image URL or short text/emoji (10 characters max)
// //           </p>
// //         </div>
// //       )
// //     }
// //   }

// //   return (
// //     <div className="card mb-6">
// //       <form onSubmit={handleSubmit}>
// //         <textarea
// //           value={content}
// //           onChange={(e) => {
// //             setContent(e.target.value)
// //             setError('')
// //           }}
// //           placeholder="What's on your mind?"
// //           className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           rows="3"
// //         />
        
// //         <div className="mt-4">
// //           <input
// //             type="text"
// //             value={image}
// //             onChange={(e) => setImage(e.target.value)}
// //             placeholder="Add image URL (https://...) or emoji/text"
// //             className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //           <div className="text-xs text-gray-500 mt-1">
// //             💡 Tip: Paste an image URL or enter emojis/short text (max 10 chars)
// //           </div>
// //           {getImagePreview()}
// //         </div>

// //         {error && (
// //           <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
// //             {error}
// //           </div>
// //         )}

// //         <div className="flex items-center justify-between mt-4">
// //           <div className="text-sm text-gray-500">
// //             {content.length}/500 characters
// //           </div>
// //           <button
// //             type="submit"
// //             disabled={loading || !content.trim() || content.length > 500}
// //             className="btn-primary disabled:opacity-50"
// //           >
// //             {loading ? 'Posting...' : 'Post'}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   )
// // }

// // export default CreatePost

// import React, { useState, useRef } from 'react'
// import axios from 'axios'

// const CreatePost = ({ onPostCreated }) => {
//   const [content, setContent] = useState('')
//   const [emoji, setEmoji] = useState('')
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [imagePreview, setImagePreview] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const fileInputRef = useRef(null)

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       // Validate file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         setError('Image file size cannot exceed 5MB')
//         return
//       }

//       // Validate file type
//       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
//       if (!allowedTypes.includes(file.type)) {
//         setError('Only JPEG, PNG, GIF, and WebP images are allowed')
//         return
//       }

//       setSelectedImage(file)
//       setError('')

//       // Create preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target.result)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const removeImage = () => {
//     setSelectedImage(null)
//     setImagePreview(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!content.trim()) {
//       setError('Post content is required')
//       return
//     }

//     setLoading(true)
//     setError('')
    
//     try {
//       // Create FormData for file upload
//       const formData = new FormData()
//       formData.append('content', content)
//       if (emoji.trim()) {
//         formData.append('emoji', emoji.trim())
//       }
//       if (selectedImage) {
//         formData.append('image', selectedImage)
//       }

//       const response = await axios.post('/api/posts/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
      
//       onPostCreated(response.data)
//       setContent('')
//       setEmoji('')
//       setSelectedImage(null)
//       setImagePreview(null)
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//     } catch (error) {
//       console.error('Error creating post:', error)
//       if (error.response?.data) {
//         const errorData = error.response.data
//         if (errorData.image) {
//           setError(errorData.image[0])
//         } else if (errorData.emoji) {
//           setError(errorData.emoji[0])
//         } else if (errorData.content) {
//           setError(errorData.content[0])
//         } else {
//           setError('Failed to create post. Please try again.')
//         }
//       } else {
//         setError('Failed to create post. Please try again.')
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const sizes = ['Bytes', 'KB', 'MB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
//   }

//   return (
//     <div className="card mb-6">
//       <form onSubmit={handleSubmit}>
//         {/* Content textarea */}
//         <textarea
//           value={content}
//           onChange={(e) => {
//             setContent(e.target.value)
//             setError('')
//           }}
//           placeholder="What's on your mind?"
//           className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//           rows="3"
//           maxLength="1000"
//         />
        
//         {/* Emoji/text decoration input */}
//         <div className="mt-4">
//           <input
//             type="text"
//             value={emoji}
//             onChange={(e) => setEmoji(e.target.value)}
//             placeholder="Add emoji or short text decoration (optional)"
//             className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             maxLength="10"
//           />
//           <div className="text-xs text-gray-500 mt-1">
//             💡 Optional: Add emojis or short text (max 10 characters)
//           </div>
//         </div>

//         {/* Image upload section */}
//         <div className="mt-4">
//           <div className="flex items-center space-x-3">
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//             >
//               <span>📷</span>
//               <span>Add Image</span>
//             </button>
            
//             {selectedImage && (
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <span>📁 {selectedImage.name}</span>
//                 <span>({formatFileSize(selectedImage.size)})</span>
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   ❌
//                 </button>
//               </div>
//             )}
//           </div>
          
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/jpeg,image/png,image/gif,image/webp"
//             onChange={handleImageSelect}
//             className="hidden"
//           />
          
//           <div className="text-xs text-gray-500 mt-1">
//             📌 Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
//           </div>
//         </div>

//         {/* Image preview */}
//         {imagePreview && (
//           <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
//             <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="max-w-full h-48 object-cover rounded border"
//             />
//           </div>
//         )}

//         {/* Emoji preview */}
//         {emoji && (
//           <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
//             <p className="text-sm text-gray-600 mb-2">Emoji Preview:</p>
//             <div className="text-2xl text-center">{emoji}</div>
//           </div>
//         )}

//         {/* Error message */}
//         {error && (
//           <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
//             ❌ {error}
//           </div>
//         )}

//         {/* Submit section */}
//         <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
//           <div className="text-sm text-gray-500">
//             {content.length}/1000 characters
//           </div>
//           <button
//             type="submit"
//             disabled={loading || !content.trim() || content.length > 1000}
//             className="btn-primary disabled:opacity-50 flex items-center space-x-2"
//           >
//             {loading && (
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//             )}
//             <span>{loading ? 'Posting...' : 'Post'}</span>
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default CreatePost


import React, { useState, useRef } from 'react'
import axios from 'axios'

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

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

  const resetForm = () => {
    setContent('')
    setEmoji('')
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Post content is required')
      return
    }

    setLoading(true)
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
      
      // Note: We don't call onPostCreated here anymore because 
      // the WebSocket will handle the real-time update
      
      // Show success message briefly
      const successMessage = document.createElement('div')
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      successMessage.textContent = '✅ Post created successfully!'
      document.body.appendChild(successMessage)
      
      setTimeout(() => {
        document.body.removeChild(successMessage)
      }, 3000)
      
      resetForm()
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
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        {/* Content textarea */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setError('')
          }}
          placeholder="What's on your mind?"
          className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          maxLength="1000"
        />
        
        {/* Emoji/text decoration input */}
        <div className="mt-4">
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="Add emoji or short text decoration (optional)"
            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength="10"
          />
          <div className="text-xs text-gray-500 mt-1">
            💡 Optional: Add emojis or short text (max 10 characters)
          </div>
        </div>

        {/* Image upload section */}
        <div className="mt-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span>📷</span>
              <span>Add Image</span>
            </button>
            
            {selectedImage && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>📁 {selectedImage.name}</span>
                <span>({formatFileSize(selectedImage.size)})</span>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <div className="text-xs text-gray-500 mt-1">
            📌 Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
          </div>
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-48 object-cover rounded border"
            />
          </div>
        )}

        {/* Emoji preview */}
        {emoji && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">Emoji Preview:</p>
            <div className="text-2xl text-center">{emoji}</div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Submit section */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {content.length}/1000 characters
          </div>
          <button
            type="submit"
            disabled={loading || !content.trim() || content.length > 1000}
            className="btn-primary disabled:opacity-50 flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{loading ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost