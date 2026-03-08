import { useEffect } from 'react'
import api from '../services/api'
import { useChatStore } from '../store/chatStore'

export const useConversations = () => {
  const { setConversations, setMessages, setActiveConversation, conversations } =
    useChatStore()

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations')
      setConversations(res.data.data.conversations)
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    }
  }

  const loadConversation = async (id: string) => {
    try {
      const res = await api.get(`/conversations/${id}`)
      const { messages } = res.data.data.conversation
      setMessages(messages)
      setActiveConversation(id)
    } catch (err) {
      console.error('Failed to load conversation:', err)
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      await api.delete(`/conversations/${id}`)
      const { removeConversation, activeConversationId, setActiveConversation, setMessages } =
        useChatStore.getState()
      removeConversation(id)
      if (activeConversationId === id) {
        setActiveConversation(null)
        setMessages([])
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return { conversations, fetchConversations, loadConversation, deleteConversation }
}