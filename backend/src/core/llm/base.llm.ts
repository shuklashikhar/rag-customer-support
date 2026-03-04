import { ChatMessage } from '../../types/rag.types'

export interface ILLMProvider {
  stream(messages: ChatMessage[]): AsyncGenerator<string>
  complete(messages: ChatMessage[]): Promise<string>
}