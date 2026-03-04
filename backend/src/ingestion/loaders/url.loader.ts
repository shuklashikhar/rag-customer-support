import * as cheerio from 'cheerio'
import { ILoader } from './base.loader'
import { logger } from '../../utils/logger'

export class URLLoader implements ILoader {
  async load(url: string): Promise<string> {
    logger.info({ url }, 'Loading URL')

    const response = await fetch(url)
    const html = await response.text()

    const $ = cheerio.load(html)

    // Remove scripts, styles, nav, footer
    $('script, style, nav, footer, header').remove()

    // Get clean text
    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()

    return text
  }
}