export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: RetrievedChunk[]
  isStreaming?: boolean
}

export interface RetrievedChunk {
  id: string
  text: string
  score: number
  metadata: {
    source: string
    docId: string
    chunkIndex: number
  }
}

export interface Conversation {
  id: string
  title: string
  createdAt: string
  messages?: Message[]
}