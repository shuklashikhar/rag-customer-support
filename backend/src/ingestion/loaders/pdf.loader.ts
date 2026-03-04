import fs from 'fs'
import { ILoader } from './base.loader'
import { logger } from '../../utils/logger'

export class PDFLoader implements ILoader {
  async load(filePath: string): Promise<string> {
    logger.info({ filePath }, 'Loading PDF')

    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

    const buffer = fs.readFileSync(filePath)
    const uint8Array = new Uint8Array(buffer)

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdfDoc = await loadingTask.promise

    const totalPages = pdfDoc.numPages
    const pages: string[] = []

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
      pages.push(pageText)
    }

    return pages.join('\n')
  }
}