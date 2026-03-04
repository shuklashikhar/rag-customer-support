export interface Chunk {
  id: string
  text: string
  metadata: {
    source: string
    docId: string
    fileType: string
    chunkIndex: number
  }
}

export interface ChunkWithEmbedding extends Chunk {
  embedding: number[]
}