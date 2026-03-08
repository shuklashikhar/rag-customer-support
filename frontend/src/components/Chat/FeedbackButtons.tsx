import { useState } from 'react'
import api from '../../services/api'

export const FeedbackButtons = ({ messageId }: { messageId: string }) => {
  const [rated, setRated] = useState<1 | -1 | null>(null)

  const submitFeedback = async (rating: 1 | -1) => {
    try {
      await api.post('/feedback', { messageId, rating })
      setRated(rating)
    } catch (err) {
      console.error('Feedback failed:', err)
    }
  }

  if (rated !== null) {
    return (
      <span style={{ color: '#666', fontSize: '12px' }}>
        {rated === 1 ? '👍 Thanks!' : '👎 Sorry about that!'}
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
      <button
        onClick={() => submitFeedback(1)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '3px 8px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        👍
      </button>
      <button
        onClick={() => submitFeedback(-1)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #444',
          borderRadius: '6px',
          padding: '3px 8px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        👎
      </button>
    </div>
  )
}