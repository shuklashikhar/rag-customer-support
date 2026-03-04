import { ChromaClient } from 'chromadb'
import { IVectorStore, SearchResult } from './base.vectorStore'
import { ChunkWithEmbedding } from '../types/document.types'
import { config } from '../config/index'
import { logger } from '../utils/logger'

const COLLECTION_NAME = 'customer_support'

export class ChromaStore implements IVectorStore {

  private client: ChromaClient

  constructor() {
    this.client = new ChromaClient({ path: config.CHROMA_URL })
  }

  private async getOrCreateCollection() {
    return this.client.getOrCreateCollection({
      name: COLLECTION_NAME
    })
  }

  async upsert(chunks: ChunkWithEmbedding[]): Promise<void> {
    const collection = await this.getOrCreateCollection()

    logger.info({ count: chunks.length }, 'Upserting chunks to ChromaDB')

    await collection.upsert({
      ids: chunks.map(c => c.id),
      embeddings: chunks.map(c => c.embedding),
      documents: chunks.map(c => c.text),
      metadatas: chunks.map(c => c.metadata)
    })

    logger.info('Chunks upserted successfully')
  }

  async similaritySearch(
    embedding: number[],
    topK: number
  ): Promise<SearchResult[]> {
    const collection = await this.getOrCreateCollection()

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: ['documents', 'metadatas', 'distances'] as any
    })

    return results.ids[0].map((id, i) => ({
      id,
      text: results.documents[0][i] ?? '',
      score: 1 / (1 + (results.distances?.[0][i] ?? 0)),
      metadata: results.metadatas?.[0][i] as Record<string, any> ?? {}
    }))
  }

  async deleteByDocId(docId: string): Promise<void> {
    const collection = await this.getOrCreateCollection()

    await collection.delete({
      where: { docId }
    })

    logger.info({ docId }, 'Deleted chunks from ChromaDB')
  }
}