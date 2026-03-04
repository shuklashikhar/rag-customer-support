import fs from 'fs'
import csv from 'csv-parser'
import { ILoader } from './base.loader'
import { logger } from '../../utils/logger'

export class CSVLoader implements ILoader {
  async load(filePath: string): Promise<string> {
    logger.info({ filePath }, 'Loading CSV')

    return new Promise((resolve, reject) => {
      const rows: string[] = []

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: Record<string, string>) => {
          // Convert each row into a readable sentence
          const line = Object.entries(row)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
          rows.push(line)
        })
        .on('end', () => resolve(rows.join('\n')))
        .on('error', reject)
    })
  }
}