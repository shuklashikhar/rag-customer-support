import { useEffect, useRef } from 'react'
import { ConversationSidebar } from '../components/Chat/ConversationSidebar'
import { MessageBubble } from '../components/Chat/MessageBubble'
import { InputBar } from '../components/Chat/InputBar'
import { Header } from '../components/Layout/Header'
import { useChatStore } from '../store/chatStore'

export const ChatPage = () => {
  const { messages } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={{
      height: '100vh',
      width: '100vw',              // add this
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f0f1a',
      overflow: 'hidden'           // add this
    }}>
      <Header />
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        width: '100%'              // add this
      }}>
        <ConversationSidebar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,             // add this — fixes flex child width collapse
          width: '100%'            // add this
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            width: '100%'          // add this
          }}>
            {messages.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#555'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                <h3 style={{ color: '#888', marginBottom: '8px' }}>TechMart Support</h3>
                <p style={{ fontSize: '14px', textAlign: 'center' }}>
                  Ask me anything about refunds, shipping, passwords, or any support topic.
                </p>
              </div>
            )}
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
          <InputBar />
        </div>
      </div>
    </div>
  )
}