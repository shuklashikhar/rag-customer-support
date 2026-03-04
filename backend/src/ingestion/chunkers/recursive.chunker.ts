import { v4 as uuidv4 } from 'uuid'
import { Chunk } from '../../types/document.types'

interface ChunkerOptions {
  chunkSize: number
  overlap: number
}

export class RecursiveChunker {
  private chunkSize: number
  private overlap: number

  constructor(options: ChunkerOptions = { chunkSize: 512, overlap: 64 }) {
    this.chunkSize = options.chunkSize
    this.overlap = options.overlap
  }

  chunk(
    text: string,
    metadata: { source: string; docId: string; fileType: string }
  ): Chunk[] {
    const chunks: Chunk[] = []

    // Split by paragraphs first, then sentences, then words
    const separators = ['\n\n', '\n', '. ', ' ']
    const pieces = this.splitText(text, separators)

    let currentChunk = ''
    let chunkIndex = 0

    for (const piece of pieces) {
      if ((currentChunk + piece).length <= this.chunkSize) {
        currentChunk += piece
      } else {
        if (currentChunk.trim().length > 0) {
          chunks.push({
            id: uuidv4(),
            text: currentChunk.trim(),
            metadata: { ...metadata, chunkIndex }
          })
          chunkIndex++
          // Keep overlap from end of current chunk
          currentChunk = currentChunk.slice(-this.overlap) + piece
        } else {
          currentChunk = piece
        }
      }
    }

    // Push final chunk
    if (currentChunk.trim().length > 0) {
      chunks.push({
        id: uuidv4(),
        text: currentChunk.trim(),
        metadata: { ...metadata, chunkIndex }
      })
    }

    return chunks
  }

  private splitText(text: string, separators: string[]): string[] {
    if (separators.length === 0) return [text]

    const [separator, ...rest] = separators
    const parts = text.split(separator)

    if (parts.length === 1) {
      return this.splitText(text, rest)
    }

    return parts.map(p => p + separator)
  }
}