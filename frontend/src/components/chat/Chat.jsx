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
  const messagesEndRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
      connectWebSocket(selectedUser.id)
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
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

  const connectWebSocket = (userId) => {
    const roomName = [user.id, userId].sort().join('_')
    const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/`
    
    wsRef.current = new WebSocket(wsUrl)
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: { id: data.sender_id },
        receiver: { id: data.receiver_id },
        message: data.message,
        timestamp: new Date().toISOString()
      }])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() && selectedUser && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        message: newMessage,
        sender_id: user.id,
        receiver_id: selectedUser.id
      }))
      setNewMessage('')
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
                  <h4 className="font-semibold">@{selectedUser.username}</h4>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender.id === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {message.message}
                    </div>
                  </div>
                ))}
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
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Send
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