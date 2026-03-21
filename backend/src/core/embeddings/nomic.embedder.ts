import { IEmbedder } from './base.embedder'
import { logger } from '../../utils/logger'

export class NomicEmbedder implements IEmbedder {

  async embed(text: string): Promise<number[]> {
    const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`
      },
      body: JSON.stringify({
        texts: [text],
        model: 'nomic-embed-text-v1.5',
        task_type: 'search_document'
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Nomic embedding failed: ${err}`)
    }

    const data = await response.json() as { embeddings: number[][] }
    return data.embeddings[0]
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    logger.info({ count: texts.length }, 'Batch embedding with Nomic')

    const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`
      },
      body: JSON.stringify({
        texts,
        model: 'nomic-embed-text-v1.5',
        task_type: 'search_document'
      })
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Nomic batch embedding failed: ${err}`)
    }

    const data = await response.json() as { embeddings: number[][] }
    return data.embeddings
  }
}