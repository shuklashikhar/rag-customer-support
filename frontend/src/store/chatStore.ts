import { create } from 'zustand'
import type  { Message, Conversation } from '../types/chat.types'

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Message[]
  isStreaming: boolean
  setConversations: (conversations: Conversation[]) => void
  setActiveConversation: (id: string | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  finalizeLastMessage: (sources?: any[]) => void
  setStreaming: (val: boolean) => void
  addConversation: (conversation: Conversation) => void
  removeConversation: (id: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last && last.role === 'assistant') {
        messages[messages.length - 1] = { ...last, content: last.content + content }
      }
      return { messages }
    }),

  finalizeLastMessage: (sources) =>
    set((state) => {
      const messages = [...state.messages]
      const last = messages[messages.length - 1]
      if (last && last.role === 'assistant') {
        messages[messages.length - 1] = {
          ...last,
          isStreaming: false,
          sources
        }
      }
      return { messages }
    }),

  setStreaming: (val) => set({ isStreaming: val }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations]
    })),
  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id)
    }))
}))