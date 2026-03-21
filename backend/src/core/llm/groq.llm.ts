import Groq from 'groq-sdk'
import { ILLMProvider } from './base.llm'
import { ChatMessage } from '../../types/rag.types'

export class GroqLLM implements ILLMProvider {
  private client: Groq

  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }

  async *stream(messages: ChatMessage[]): AsyncGenerator<string> {
    

    const stream = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      stream: true,
      temperature: 0.2,
      max_tokens: 1024
    })
     
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        
        yield content
      }
    }
    
  }
  

  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.2,
      max_tokens: 1024
    })
    return response.choices[0].message.content ?? ''
  }
}