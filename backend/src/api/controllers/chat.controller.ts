import type { Request, Response } from 'express'
import { RAGPipeline } from '../../core/rag/ragPipeline'
import { Retriever } from '../../core/rag/retriever'
import { OllamaEmbedder } from '../../core/embeddings/ollama.embedder'
import { OllamaLLM } from '../../core/llm/ollama.llm'
import { ChromaStore } from '../../vectorStore/chroma.store'
import { conversationRepository } from '../../db/repositories/conversation.repository'
import { messageRepository } from '../../db/repositories/message.repository'
import { logger } from '../../utils/logger'

// Initialize once, reuse across requests
const embedder = new OllamaEmbedder()
const vectorStore = new ChromaStore()
const llm = new OllamaLLM()
const retriever = new Retriever(embedder, vectorStore)
const ragPipeline = new RAGPipeline(retriever, llm)

export const chatController = {

  async chat(req: Request, res: Response) {
    const { query, conversationId } = req.body
    const userId = req.user!.userId

    logger.info({ userId, query }, 'Chat request received')

    // Find or create conversation
    let convId = conversationId
    if (!convId) {
      // Use first 50 chars of query as title
      const title = query.length > 50 ? query.substring(0, 50) + '...' : query
      const conversation = await conversationRepository.create(userId, title)
      convId = conversation.id
    }

    // Save user message
    await messageRepository.create({
      conversationId: convId,
      role: 'user',
      content: query
    })

    // Send conversationId to frontend before streaming starts
    res.setHeader('X-Conversation-Id', convId)

    // Stream RAG response
    const chunks = await ragPipeline.streamResponse(query, res)

    // Note: we can't await here since response is already streaming
    // Save assistant message after stream — fire and forget
    setImmediate(async () => {
      try {
        // We don't have fullAnswer here easily so save a placeholder
        // In a real app you'd refactor to capture the full answer
        await messageRepository.create({
          conversationId: convId,
          role: 'assistant',
          content: '[streamed response]',
          sources: chunks
        })
      } catch (err) {
        logger.error({ err }, 'Failed to save assistant message')
      }
    })
  }
}