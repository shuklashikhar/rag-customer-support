import { RetrievedChunk } from '../../types/rag.types'

export class ContextBuilder {
  build(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) return ''

    return chunks
      .map((chunk, i) =>
        `[Source ${i + 1}: ${chunk.metadata.source}]\n${chunk.text}`
      )
      .join('\n\n---\n\n')
  }
}