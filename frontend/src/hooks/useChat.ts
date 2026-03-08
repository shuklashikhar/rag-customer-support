import { useChatStore } from '../store/chatStore'
import { useAuthStore } from '../store/authStore'
import { v4 as uuidv4 } from 'uuid'

export const useChat = () => {
  const { token } = useAuthStore()
  const {
    addMessage,
    updateLastMessage,
    finalizeLastMessage,
    setStreaming,
    setActiveConversation,
    addConversation
  } = useChatStore()

  const sendMessage = async (query: string, conversationId?: string) => {
    if (!query.trim()) return

    // Add user message instantly
    addMessage({
      id: uuidv4(),
      role: 'user',
      content: query
    })

    // Add empty assistant message to stream into
    addMessage({
      id: uuidv4(),
      role: 'assistant',
      content: '',
      isStreaming: true
    })

    setStreaming(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ query, conversationId })
        }
      )

      if (!response.ok) throw new Error('Chat request failed')

      // Get conversation ID from header
      const convId = response.headers.get('X-Conversation-Id')
      if (convId) {
        setActiveConversation(convId)
        if (!conversationId) {
          addConversation({
            id: convId,
            title: query.length > 50 ? query.substring(0, 50) + '...' : query,
            createdAt: new Date().toISOString()
          })
        }
      }

      // Read SSE stream
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let sources: any[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          try {
            const data = JSON.parse(line.replace('data: ', ''))

            if (data.type === 'sources') {
              sources = data.chunks
            } else if (data.type === 'token') {
              updateLastMessage(data.content)
            } else if (data.type === 'done') {
              finalizeLastMessage(sources)
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      finalizeLastMessage()
      console.error('Chat error:', err)
    } finally {
      setStreaming(false)
    }
  }

  return { sendMessage }
}