export interface Document {
  id: string
  name: string
  fileType: string
  status: 'processing' | 'ready' | 'failed'
  chunkCount: number
  createdAt: string
}