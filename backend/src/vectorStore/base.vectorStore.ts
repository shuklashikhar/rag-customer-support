import { ChunkWithEmbedding } from '../types/document.types'

export interface SearchResult {
  id: string
  text: string
  score: number
  metadata: Record<string, any>
}

export interface IVectorStore {
  upsert(chunks: ChunkWithEmbedding[]): Promise<void>
  similaritySearch(embedding: number[], topK: number): Promise<SearchResult[]>
  deleteByDocId(docId: string): Promise<void>
}