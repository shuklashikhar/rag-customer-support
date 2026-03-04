export interface RetrievedChunk {
  id: string
  text: string
  score: number
  metadata: {
    source: string
    docId: string
    fileType: string
    chunkIndex: number
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}