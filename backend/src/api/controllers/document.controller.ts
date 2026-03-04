import type { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { IngestionPipeline } from '../../ingestion/ingestionPipeline'
import { OllamaEmbedder } from '../../core/embeddings/ollama.embedder'
import { ChromaStore } from '../../vectorStore/chroma.store'
import { documentRepository } from '../../db/repositories/document.repository'
import { AppError } from '../middlewares/errorHandler.middleware'
import { logger } from '../../utils/logger'

const embedder = new OllamaEmbedder()
const vectorStore = new ChromaStore()
const ingestionPipeline = new IngestionPipeline(embedder, vectorStore)

export const documentController = {

  async upload(req: Request, res: Response) {
    if (!req.file) {
      throw new AppError('No file uploaded', 400)
    }

    const { originalname, path: filePath, mimetype } = req.file
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'csv'
    const docId = uuidv4()

    // Save to DB with processing status
    await documentRepository.create({
      id: docId,
      name: originalname,
      fileType,
      uploadedBy: req.user!.userId
    })

    // Respond immediately
    res.status(202).json({
      success: true,
      message: 'File received, processing started',
      data: { docId, name: originalname }
    })

    // Process in background (after response sent)
    setImmediate(async () => {
      try {
        const chunkCount = await ingestionPipeline.ingestFile(
          filePath,
          docId,
          originalname,
          fileType
        )

        await documentRepository.updateStatus(docId, 'ready', chunkCount)
        logger.info({ docId, chunkCount }, 'Ingestion complete')
      } catch (error) {
        
        await documentRepository.updateStatus(docId, 'failed')
        logger.error({ docId, error: error instanceof Error ? error.message : String(error) }, 'Ingestion failed')
      } finally {
        // Clean up uploaded file
        fs.unlink(filePath, () => {})
      }
    })
  },

  async list(req: Request, res: Response) {
    const documents = await documentRepository.findAll()
    res.json({ success: true, data: { documents } })
  },

  async delete(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params

    const doc = await documentRepository.findById(id)
    if (!doc) {
      throw new AppError('Document not found', 404)
    }

    // Delete from vector store
    await vectorStore.deleteByDocId(id)

    // Delete from DB
    await documentRepository.delete(id)

    res.json({ success: true, message: 'Document deleted' })
  }

}