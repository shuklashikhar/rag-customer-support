import { useConversations } from '../../hooks/useConversations'
import { useChatStore } from '../../store/chatStore'

export const ConversationSidebar = () => {
  const { conversations, loadConversation, deleteConversation } = useConversations()
  const { activeConversationId, setMessages, setActiveConversation } = useChatStore()

  const startNew = () => {
    setMessages([])
    setActiveConversation(null)
  }

  return (
    <div style={{
      width: '260px',
      backgroundColor: '#111122',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '16px' }}>
        <button
          onClick={startNew}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4a90d9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          + New Chat
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {conversations.length === 0 && (
          <p style={{ color: '#555', textAlign: 'center', fontSize: '13px', padding: '20px' }}>
            No conversations yet
          </p>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 8px',
              borderRadius: '8px',
              marginBottom: '4px',
              backgroundColor: activeConversationId === conv.id ? '#1e1e32' : 'transparent',
              cursor: 'pointer'
            }}
          >
            <div
              onClick={() => loadConversation(conv.id)}
              style={{ flex: 1, overflow: 'hidden' }}
            >
              <div style={{
                color: activeConversationId === conv.id ? 'white' : '#ccc',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {conv.title}
              </div>
              <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>
                {new Date(conv.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteConversation(conv.id)
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#555',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}