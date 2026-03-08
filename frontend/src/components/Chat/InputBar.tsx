import { useState } from 'react'
import { useChat } from '../../hooks/useChat'
import { useChatStore } from '../../store/chatStore'

export const InputBar = () => {
  const [input, setInput] = useState('')
  const { sendMessage } = useChat()
  const { isStreaming, activeConversationId } = useChatStore()

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return
    const query = input
    setInput('')
    await sendMessage(query, activeConversationId ?? undefined)
  }

  return (
    <div style={{
      padding: '16px 20px',
      borderTop: '1px solid #333',
      backgroundColor: '#0f0f1a',
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end'
    }}>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
        placeholder="Ask a question... (Enter to send, Shift+Enter for new line)"
        rows={1}
        style={{
          flex: 1,
          padding: '12px 14px',
          backgroundColor: '#1a1a2e',
          border: '1px solid #444',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          resize: 'none',
          outline: 'none',
          fontFamily: 'inherit',
          lineHeight: '1.5'
        }}
      />
      <button
        onClick={handleSend}
        disabled={isStreaming || !input.trim()}
        style={{
          padding: '12px 20px',
          backgroundColor: isStreaming || !input.trim() ? '#333' : '#4a90d9',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}
      >
        {isStreaming ? '...' : 'Send →'}
      </button>
    </div>
  )
}