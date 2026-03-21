import OpenAI from 'openai'
import { IEmbedder } from './base.embedder'
import { logger } from '../../utils/logger'

export class OpenAIEmbedder implements IEmbedder {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    })
    return response.data[0].embedding
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    logger.info({ count: texts.length }, 'Batch embedding with OpenAI')
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts
    })
    return response.data.map(d => d.embedding)
  }
}