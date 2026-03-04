import { RetrievedChunk } from '../../types/rag.types'

export const buildUserPrompt = (
  query: string,
  chunks: RetrievedChunk[]
): string => {
  if (chunks.length === 0) {
    return `Customer question: ${query}\n\nNo relevant context found. Please let the customer know politely.`
  }

  const context = chunks
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.metadata.source}]\n${chunk.text}`)
    .join('\n\n---\n\n')

  return `Use the following context to answer the customer question.

CONTEXT:
${context}

---

Customer question: ${query}

Answer:`
}