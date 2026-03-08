import { useState } from 'react'
import type  { RetrievedChunk } from '../../types/chat.types'

export const SourceCitation = ({ sources }: { sources: RetrievedChunk[] }) => {
  const [expanded, setExpanded] = useState(false)

  if (!sources || sources.length === 0) return null

  return (
    <div style={{ marginTop: '8px' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #444',
          color: '#888',
          padding: '4px 10px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {expanded ? '▼' : '▶'} {sources.length} source{sources.length > 1 ? 's' : ''}
      </button>

      {expanded && (
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sources.map((source, i) => (
            <div
              key={source.id}
              style={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '10px 12px'
              }}
            >
              <div style={{ color: '#4a90d9', fontSize: '11px', marginBottom: '4px' }}>
                [{i + 1}] {source.metadata?.source}
                <span style={{ color: '#666', marginLeft: '8px' }}>
                  score: {source.score?.toFixed(4)}
                </span>
              </div>
              <div style={{ color: '#bbb', fontSize: '13px', lineHeight: '1.5' }}>
                {source.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}