import { ILLMProvider } from './base.llm'
import { ChatMessage } from '../../types/rag.types'
import { config } from '../../config/index'
import { logger } from '../../utils/logger'

export class OllamaLLM implements ILLMProvider {

  async *stream(messages: ChatMessage[]): AsyncGenerator<string> {
    logger.info('Starting LLM stream')

    const response = await fetch(`${config.OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.OLLAMA_LLM_MODEL,
        messages,
        stream: true
      })
    })

    if (!response.ok || !response.body) {
      throw new Error(`Ollama LLM failed: ${response.statusText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n').filter(l => l.trim())

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line) as {
            message?: { content: string }
            done: boolean
          }

          if (parsed.message?.content) {
            yield parsed.message.content
          }

          if (parsed.done) return

        } catch {
          // skip malformed lines
        }
      }
    }
  }

  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await fetch(`${config.OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.OLLAMA_LLM_MODEL,
        messages,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama LLM failed: ${response.statusText}`)
    }

    const data = await response.json() as {
      message: { content: string }
    }

    return data.message.content
  }
}