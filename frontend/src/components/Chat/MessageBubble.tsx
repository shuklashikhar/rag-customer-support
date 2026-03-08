import type { Message } from '../../types/chat.types'
import { SourceCitation } from './SourceCitation'
import { FeedbackButtons } from './FeedbackButtons'

export const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px'
    }}>
      <div style={{ maxWidth: '75%' }}>
        <div style={{
          backgroundColor: isUser ? '#4a90d9' : '#1e1e32',
          color: 'white',
          padding: '12px 16px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          fontSize: '14px',
          lineHeight: '1.6',
          border: isUser ? 'none' : '1px solid #333'
        }}>
          {message.content}
          {message.isStreaming && (
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '14px',
              backgroundColor: '#4a90d9',
              marginLeft: '4px',
              animation: 'blink 1s infinite'
            }} />
          )}
        </div>

        {!isUser && !message.isStreaming && (
          <>
            {message.sources && message.sources.length > 0 && (
              <SourceCitation sources={message.sources} />
            )}
            <FeedbackButtons messageId={message.id} />
          </>
        )}
      </div>
    </div>
  )
}