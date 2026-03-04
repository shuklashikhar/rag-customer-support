import { IEmbedder } from '../embeddings/base.embedder'
import { IVectorStore } from '../../vectorStore/base.vectorStore'
import { RetrievedChunk } from '../../types/rag.types'
import { logger } from '../../utils/logger'

const MIN_SCORE = 0.0 // ignore chunks below this relevance score

export class Retriever {
  constructor(
    private embedder: IEmbedder,
    private vectorStore: IVectorStore
  ) {}

  async retrieve(query: string, topK: number = 4): Promise<RetrievedChunk[]> {
    logger.info({ query }, 'Retrieving chunks')

    // Embed the query
    const queryEmbedding = await this.embedder.embed(query)


    // Search vector store
    const results = await this.vectorStore.similaritySearch(queryEmbedding, topK * 2)

    // Filter by minimum score + take topK
    const filtered = results
      .filter(r => r.score >= MIN_SCORE)
      .slice(0, topK)
      .map(r => ({
        id: r.id,
        text: r.text,
        score: r.score,
        metadata: r.metadata as RetrievedChunk['metadata']
      }))

      

    logger.info({ count: filtered.length }, 'Chunks retrieved')
    return filtered
  }
}