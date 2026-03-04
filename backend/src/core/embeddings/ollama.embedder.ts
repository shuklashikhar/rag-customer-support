import { IEmbedder } from './base.embedder'
import { config } from '../../config/index'
import { logger } from '../../utils/logger'

export class OllamaEmbedder implements IEmbedder {

  async embed(text: string): Promise<number[]> {
    const response = await fetch(`${config.OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.OLLAMA_EMBED_MODEL,
        prompt: text
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama embedding failed: ${response.statusText}`)
    }

    const data = await response.json() as { embedding: number[] }
    return data.embedding
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    logger.info({ count: texts.length }, 'Embedding batch')

    // Ollama does not support batch — run sequentially
    const embeddings: number[][] = []
    for (const text of texts) {
      const embedding = await this.embed(text)
      embeddings.push(embedding)
    }
    return embeddings
  }
}