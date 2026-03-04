import { IEmbedder } from '../core/embeddings/base.embedder'
import { IVectorStore } from '../vectorStore/base.vectorStore'
import { PDFLoader } from './loaders/pdf.loader'
import { CSVLoader } from './loaders/csv.loader'
import { URLLoader } from './loaders/url.loader'
import { RecursiveChunker } from './chunkers/recursive.chunker'
import { preprocessText } from './preprocessor'
import { ChunkWithEmbedding } from '../types/document.types'
import { logger } from '../utils/logger'

const BATCH_SIZE = 10

export class IngestionPipeline {
  private chunker = new RecursiveChunker({ chunkSize: 512, overlap: 64 })

  constructor(
    private embedder: IEmbedder,
    private vectorStore: IVectorStore
  ) {}

  async ingestFile(
    filePath: string,
    docId: string,
    fileName: string,
    fileType: string
  ): Promise<number> {

    // 1. Load raw text
    logger.info({ fileName, fileType }, 'Starting ingestion')
    const loader = this.getLoader(fileType)
    const rawText = await loader.load(filePath)

    // 2. Preprocess
    const cleanText = preprocessText(rawText)

    // 3. Chunk
    const chunks = this.chunker.chunk(cleanText, {
      source: fileName,
      docId,
      fileType
    })
    logger.info({ chunkCount: chunks.length }, 'Text chunked')

    // 4. Embed + store in batches
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE)

      const embeddings = await this.embedder.embedBatch(
        batch.map(c => c.text)
      )

      const chunksWithEmbeddings: ChunkWithEmbedding[] = batch.map(
        (chunk, idx) => ({
          ...chunk,
          embedding: embeddings[idx]
        })
      )

      await this.vectorStore.upsert(chunksWithEmbeddings)
      logger.info({ batch: i / BATCH_SIZE + 1 }, 'Batch upserted')
    }

    return chunks.length
  }

  async ingestURL(url: string, docId: string): Promise<number> {
    const loader = new URLLoader()
    const rawText = await loader.load(url)
    const cleanText = preprocessText(rawText)

    const chunks = this.chunker.chunk(cleanText, {
      source: url,
      docId,
      fileType: 'url'
    })

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE)
      const embeddings = await this.embedder.embedBatch(batch.map(c => c.text))
      const chunksWithEmbeddings: ChunkWithEmbedding[] = batch.map(
        (chunk, idx) => ({ ...chunk, embedding: embeddings[idx] })
      )
      await this.vectorStore.upsert(chunksWithEmbeddings)
    }

    return chunks.length
  }

  private getLoader(fileType: string) {
    switch (fileType) {
      case 'pdf': return new PDFLoader()
      case 'csv': return new CSVLoader()
      case 'url': return new URLLoader()
      default: throw new Error(`Unsupported file type: ${fileType}`)
    }
  }
}