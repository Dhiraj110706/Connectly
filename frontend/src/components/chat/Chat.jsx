// // import React, { useState, useEffect, useRef } from 'react'
// // import { useAuth } from '../../contexts/AuthContext'
// // import axios from 'axios'

// // const Chat = () => {
// //   const { user } = useAuth()
// //   const [users, setUsers] = useState([])
// //   const [selectedUser, setSelectedUser] = useState(null)
// //   const [messages, setMessages] = useState([])
// //   const [newMessage, setNewMessage] = useState('')
// //   const [loading, setLoading] = useState(true)
// //   const messagesEndRef = useRef(null)
// //   const wsRef = useRef(null)

// //   useEffect(() => {
// //     fetchUsers()
// //   }, [])

// //   useEffect(() => {
// //     if (selectedUser) {
// //       fetchMessages(selectedUser.id)
// //       connectWebSocket(selectedUser.id)
// //     }
// //     return () => {
// //       if (wsRef.current) {
// //         wsRef.current.close()
// //       }
// //     }
// //   }, [selectedUser])

// //   useEffect(() => {
// //     scrollToBottom()
// //   }, [messages])

// //   const fetchUsers = async () => {
// //     try {
// //       const response = await axios.get('/api/auth/users/')
// //       setUsers(response.data.filter(u => u.id !== user.id))
// //     } catch (error) {
// //       console.error('Error fetching users:', error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const fetchMessages = async (userId) => {
// //     try {
// //       const response = await axios.get(`/api/chat/messages/?user_id=${userId}`)
// //       setMessages(response.data)
// //     } catch (error) {
// //       console.error('Error fetching messages:', error)
// //     }
// //   }

// //   const connectWebSocket = (userId) => {
// //     const roomName = [user.id, userId].sort().join('_')
// //     const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/`
    
// //     wsRef.current = new WebSocket(wsUrl)
    
// //     wsRef.current.onmessage = (event) => {
// //       const data = JSON.parse(event.data)
// //       setMessages(prev => [...prev, {
// //         id: Date.now(),
// //         sender: { id: data.sender_id },
// //         receiver: { id: data.receiver_id },
// //         message: data.message,
// //         timestamp: new Date().toISOString()
// //       }])
// //     }
// //   }

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// //   }

// //   const handleSendMessage = (e) => {
// //     e.preventDefault()
// //     if (newMessage.trim() && selectedUser && wsRef.current) {
// //       wsRef.current.send(JSON.stringify({
// //         message: newMessage,
// //         sender_id: user.id,
// //         receiver_id: selectedUser.id
// //       }))
// //       setNewMessage('')
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-8">
// //       <div className="bg-white rounded-xl shadow-lg h-96 flex">
// //         {/* Users List */}
// //         <div className="w-1/3 border-r border-gray-200 p-4">
// //           <h3 className="text-lg font-semibold mb-4">Chats</h3>
// //           <div className="space-y-2">
// //             {users.map(chatUser => (
// //               <button
// //                 key={chatUser.id}
// //                 onClick={() => setSelectedUser(chatUser)}
// //                 className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
// //                   selectedUser?.id === chatUser.id ? 'bg-blue-100' : ''
// //                 }`}
// //               >
// //                 <div className="flex items-center space-x-3">
// //                   <span className="text-2xl">{chatUser.avatar}</span>
// //                   <div>
// //                     <div className="font-medium">@{chatUser.username}</div>
// //                     <div className="text-sm text-gray-500">Click to chat</div>
// //                   </div>
// //                 </div>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Chat Area */}
// //         <div className="flex-1 flex flex-col">
// //           {selectedUser ? (
// //             <>
// //               <div className="p-4 border-b border-gray-200">
// //                 <div className="flex items-center space-x-3">
// //                   <span className="text-2xl">{selectedUser.avatar}</span>
// //                   <h4 className="font-semibold">@{selectedUser.username}</h4>
// //                 </div>
// //               </div>

// //               <div className="flex-1 overflow-y-auto p-4 space-y-3">
// //                 {messages.map(message => (
// //                   <div
// //                     key={message.id}
// //                     className={`flex ${
// //                       message.sender.id === user.id ? 'justify-end' : 'justify-start'
// //                     }`}
// //                   >
// //                     <div className={`max-w-xs px-4 py-2 rounded-lg ${
// //                       message.sender.id === user.id
// //                         ? 'bg-blue-600 text-white'
// //                         : 'bg-gray-200 text-gray-800'
// //                     }`}>
// //                       {message.message}
// //                     </div>
// //                   </div>
// //                 ))}
// //                 <div ref={messagesEndRef} />
// //               </div>

// //               <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
// //                 <div className="flex space-x-2">
// //                   <input
// //                     type="text"
// //                     value={newMessage}
// //                     onChange={(e) => setNewMessage(e.target.value)}
// //                     placeholder="Type a message..."
// //                     className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                   <button
// //                     type="submit"
// //                     className="btn-primary"
// //                   >
// //                     Send
// //                   </button>
// //                 </div>
// //               </form>
// //             </>
// //           ) : (
// //             <div className="flex-1 flex items-center justify-center text-gray-500">
// //               Select a user to start chatting
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Chat

// import React, { useState, useEffect, useRef } from 'react'
// import { useAuth } from '../../contexts/AuthContext'
// import axios from 'axios'

// const Chat = () => {
//   const { user } = useAuth()
//   const [users, setUsers] = useState([])
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [messages, setMessages] = useState([])
//   const [newMessage, setNewMessage] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [wsConnected, setWsConnected] = useState(false)
//   const messagesEndRef = useRef(null)
//   const wsRef = useRef(null)

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   useEffect(() => {
//     if (selectedUser) {
//       fetchMessages(selectedUser.id)
//       connectWebSocket(selectedUser.id)
//     }
    
//     // Cleanup function
//     return () => {
//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         wsRef.current.close()
//       }
//     }
//   }, [selectedUser])

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('/api/auth/users/')
//       setUsers(response.data.filter(u => u.id !== user.id))
//     } catch (error) {
//       console.error('Error fetching users:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchMessages = async (userId) => {
//     try {
//       const response = await axios.get(`/api/chat/messages/?user_id=${userId}`)
//       setMessages(response.data)
//     } catch (error) {
//       console.error('Error fetching messages:', error)
//     }
//   }

//   const connectWebSocket = (userId) => {
//     // Close existing connection if any
//     if (wsRef.current) {
//       wsRef.current.close()
//     }

//     const roomName = [user.id, userId].sort().join('_')
//     const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/`
    
//     console.log('Connecting to WebSocket:', wsUrl)
    
//     wsRef.current = new WebSocket(wsUrl)
    
//     wsRef.current.onopen = () => {
//       console.log('WebSocket connected')
//       setWsConnected(true)
//     }
    
//     wsRef.current.onclose = (event) => {
//       console.log('WebSocket closed:', event.code, event.reason)
//       setWsConnected(false)
//     }
    
//     wsRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error)
//       setWsConnected(false)
//     }
    
//     wsRef.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data)
//         console.log('Received message:', data)
        
//         const newMessage = {
//           id: Date.now() + Math.random(), // Ensure unique ID
//           sender: { id: data.sender_id },
//           receiver: { id: data.receiver_id },
//           message: data.message,
//           timestamp: new Date().toISOString()
//         }
        
//         setMessages(prev => [...prev, newMessage])
//       } catch (error) {
//         console.error('Error parsing WebSocket message:', error)
//       }
//     }
//   }

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const handleSendMessage = (e) => {
//     e.preventDefault()
    
//     if (!newMessage.trim()) {
//       console.log('Message is empty')
//       return
//     }
    
//     if (!selectedUser) {
//       console.log('No user selected')
//       return
//     }
    
//     if (!wsRef.current) {
//       console.log('WebSocket not initialized')
//       return
//     }
    
//     if (wsRef.current.readyState !== WebSocket.OPEN) {
//       console.log('WebSocket not connected. State:', wsRef.current.readyState)
//       alert('Connection lost. Please refresh and try again.')
//       return
//     }

//     try {
//       const messageData = {
//         message: newMessage.trim(),
//         sender_id: user.id,
//         receiver_id: selectedUser.id
//       }
      
//       console.log('Sending message:', messageData)
//       wsRef.current.send(JSON.stringify(messageData))
//       setNewMessage('')
//     } catch (error) {
//       console.error('Error sending message:', error)
//       alert('Failed to send message. Please try again.')
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
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <div className="bg-white rounded-xl shadow-lg h-96 flex">
//         {/* Users List */}
//         <div className="w-1/3 border-r border-gray-200 p-4">
//           <h3 className="text-lg font-semibold mb-4">Chats</h3>
//           <div className="space-y-2">
//             {users.map(chatUser => (
//               <button
//                 key={chatUser.id}
//                 onClick={() => setSelectedUser(chatUser)}
//                 className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
//                   selectedUser?.id === chatUser.id ? 'bg-blue-100' : ''
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <span className="text-2xl">{chatUser.avatar}</span>
//                   <div>
//                     <div className="font-medium">@{chatUser.username}</div>
//                     <div className="text-sm text-gray-500">Click to chat</div>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {selectedUser ? (
//             <>
//               <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center space-x-3">
//                   <span className="text-2xl">{selectedUser.avatar}</span>
//                   <div>
//                     <h4 className="font-semibold">@{selectedUser.username}</h4>
//                     <div className="flex items-center space-x-2">
//                       <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                       <span className="text-xs text-gray-500">
//                         {wsConnected ? 'Connected' : 'Disconnected'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                 {messages.length === 0 ? (
//                   <div className="text-center text-gray-500 mt-8">
//                     No messages yet. Start the conversation!
//                   </div>
//                 ) : (
//                   messages.map(message => (
//                     <div
//                       key={message.id}
//                       className={`flex ${
//                         message.sender.id === user.id ? 'justify-end' : 'justify-start'
//                       }`}
//                     >
//                       <div className={`max-w-xs px-4 py-2 rounded-lg break-words ${
//                         message.sender.id === user.id
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-200 text-gray-800'
//                       }`}>
//                         {message.message}
//                       </div>
//                     </div>
//                   ))
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder={wsConnected ? "Type a message..." : "Connecting..."}
//                     className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     disabled={!wsConnected}
//                   />
//                   <button
//                     type="submit"
//                     disabled={!wsConnected || !newMessage.trim()}
//                     className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Send
//                   </button>
//                 </div>
//               </form>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center text-gray-500">
//               Select a user to start chatting
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Chat



import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

const Chat = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
      startPolling(selectedUser.id)
    } else {
      stopPolling()
    }
    
    return () => stopPolling()
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users/')
      setUsers(response.data.filter(u => u.id !== user.id))
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`/api/chat/messages/?user_id=${userId}`)
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const startPolling = (userId) => {
    // Poll for new messages every 2 seconds
    pollingRef.current = setInterval(() => {
      fetchMessages(userId)
    }, 2000)
  }

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedUser || sending) {
      return
    }

    setSending(true)
    
    try {
      const response = await axios.post('/api/chat/send/', {
        receiver_id: selectedUser.id,
        message: newMessage.trim()
      })
      
      // Add the new message to the list immediately
      setMessages(prev => [...prev, response.data])
      setNewMessage('')
      
      // Fetch messages again to ensure we have the latest
      setTimeout(() => fetchMessages(selectedUser.id), 100)
      
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg h-96 flex">
        {/* Users List */}
        <div className="w-1/3 border-r border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4">Chats</h3>
          <div className="space-y-2">
            {users.map(chatUser => (
              <button
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser)}
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  selectedUser?.id === chatUser.id ? 'bg-blue-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{chatUser.avatar}</span>
                  <div>
                    <div className="font-medium">@{chatUser.username}</div>
                    <div className="text-sm text-gray-500">Click to chat</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedUser.avatar}</span>
                  <div>
                    <h4 className="font-semibold">@{selectedUser.username}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-500">HTTP Chat (Auto-refresh)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender.id === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-lg break-words ${
                        message.sender.id === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        <div className="text-sm">{message.message}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender.id === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat