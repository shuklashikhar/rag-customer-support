import { ILLMProvider } from '../llm/base.llm'
import { Retriever } from './retriever'
import { ContextBuilder } from './contextBuilder'
import { redisCache } from '../../cache/redis.cache'
import { buildSystemPrompt } from '../prompts/system.prompt'
import { buildUserPrompt } from '../prompts/templates'
import { RetrievedChunk } from '../../types/rag.types'
import { logger } from '../../utils/logger'
import type { Response } from 'express'

export class RAGPipeline {
  private contextBuilder = new ContextBuilder()

  constructor(
    private retriever: Retriever,
    private llm: ILLMProvider
  ) {}

  async streamResponse(
    query: string,
    res: Response
  ): Promise<RetrievedChunk[]> {

    // 1. Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // 2. Check cache
    const cacheKey = redisCache.buildKey(query)
    const cached = await redisCache.get(cacheKey)

    if (cached) {
      logger.info('Cache hit')
      const parsed = JSON.parse(cached)

      // Send cached sources
      res.write(`data: ${JSON.stringify({ type: 'sources', chunks: parsed.chunks })}\n\n`)

      // Send cached answer token by token
      for (const char of parsed.answer) {
        res.write(`data: ${JSON.stringify({ type: 'token', content: char })}\n\n`)
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
      res.end()
      return parsed.chunks
    }

    // 3. Retrieve relevant chunks
    const chunks = await this.retriever.retrieve(query, 4)

    // 4. Send sources to frontend immediately
    res.write(`data: ${JSON.stringify({ type: 'sources', chunks })}\n\n`)

    // 5. Build messages
    const messages = [
      { role: 'system' as const, content: buildSystemPrompt() },
      { role: 'user' as const, content: buildUserPrompt(query, chunks) }
    ]

    // 6. Stream LLM response
    let fullAnswer = ''
    for await (const token of this.llm.stream(messages)) {
      fullAnswer += token
      res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`)
    }

    // 7. Send done signal
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()

    // 8. Cache the result
    await redisCache.set(cacheKey, JSON.stringify({
      answer: fullAnswer,
      chunks
    }))

    logger.info('RAG response complete')
    return chunks
  }
}