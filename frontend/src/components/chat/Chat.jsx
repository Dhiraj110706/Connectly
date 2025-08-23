import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const Chat = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)
  const pollingRef = useRef(null)

  useEffect(() => {
    fetchChatUsers()
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

  // Fetch users who are followers or following (for chat)
  const fetchChatUsers = async () => {
    try {
      setLoading(true)
      
      // Get followers
      const followersResponse = await axios.get(`/api/auth/users/${user.id}/followers/`)
      
      // Get following
      const followingResponse = await axios.get(`/api/auth/users/${user.id}/following/`)
      
      // Combine and deduplicate users
      const allChatUsers = [...followersResponse.data, ...followingResponse.data]
      const uniqueUsers = allChatUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      )
      
      setUsers(uniqueUsers)
    } catch (error) {
      console.error('Error fetching chat users:', error)
      // Fallback: show empty list if error
      setUsers([])
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
      // If 403 or other error, clear messages
      if (error.response?.status === 403) {
        setMessages([])
        alert('You can only chat with users who follow you or users you follow.')
      }
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
      if (error.response?.status === 403) {
        alert('You can only send messages to users who follow you or users you follow.')
      } else {
        alert('Failed to send message. Please try again.')
      }
    } finally {
      setSending(false)
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading your chat contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl h-[calc(100vh-4rem)] mx-auto max-h-screen flex flex-col p-4 bg-gradient-to-br my-3 from-indigo-50 to-purple-50 border-dark-800">
      <div className="bg-white rounded-2xl shadow-xl flex flex-1 overflow-hidden">
        {/* Users List */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Messages</h2>
            <p className="text-xs text-gray-500 mb-3">Only followers and following</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredUsers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? (
                  <div>
                    <p className="mb-2">No contacts found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-100 p-4 rounded-full inline-block mb-3">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <p className="mb-2 font-medium">No chat contacts</p>
                    <p className="text-xs">Follow users or get followers to start chatting!</p>
                  </div>
                )}
              </div>
            ) : (
              filteredUsers.map(chatUser => (
                <motion.button
                  key={chatUser.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedUser(chatUser)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 mb-2 ${
                    selectedUser?.id === chatUser.id 
                      ? 'bg-indigo-100 border border-indigo-200 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <span className="text-2xl">{chatUser.avatar}</span>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">@{chatUser.username}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {chatUser.followers_count || 0} followers • {chatUser.following_count || 0} following
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{user.avatar}</span>
                <div>
                  <div className="font-medium text-gray-900">You</div>
                  <div className="text-xs text-gray-500">
                    {users.length} chat contact{users.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <button 
                onClick={fetchChatUsers}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                title="Refresh contacts"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedUser.avatar}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">@{selectedUser.username}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-500">Chat contact</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-indigo-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="bg-indigo-100 p-5 rounded-full mb-4">
                      <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                      </svg>
                    </div>
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm">Start the conversation with @{selectedUser.username}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words relative ${
                          message.sender.id === user.id
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                        }`}>
                          <div className="text-sm">{message.message}</div>
                          <div className={`text-xs mt-1 text-right ${
                            message.sender.id === user.id ? 'text-indigo-200' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          
                          {/* Message tail */}
                          {message.sender.id === user.id ? (
                            <div className="absolute -right-2 bottom-0 w-4 h-4 overflow-hidden">
                              <div className="w-4 h-4 bg-indigo-600 rotate-45 transform origin-bottom-left"></div>
                            </div>
                          ) : (
                            <div className="absolute -left-2 bottom-0 w-4 h-4 overflow-hidden">
                              <div className="w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45 transform origin-bottom-right"></div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {sending ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-8 text-center">
              <div className="max-w-md">
                <div className="bg-indigo-100 p-5 rounded-full inline-block mb-6">
                  <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Private Messages</h3>
                <p className="text-gray-600 mb-6">You can only chat with users who follow you or users you follow. Select a contact from the sidebar to start chatting.</p>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-left">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">Privacy Features</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">🔒</span>
                      <span>Only followers and following can message you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">🔄</span>
                      <span>Messages update automatically every 2 seconds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">🔍</span>
                      <span>Use search to find specific contacts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat