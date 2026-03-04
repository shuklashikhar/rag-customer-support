import { createClient } from 'redis'
import { config } from '../config/index'
import { logger } from '../utils/logger'

const client = createClient({ url: config.REDIS_URL })

client.on('error', (err) => logger.error({ err }, 'Redis error'))
client.on('connect', () => logger.info('✅ Redis connected'))

export const connectRedis = async () => {
  await client.connect()
}

const TTL = 60 * 60 * 2  // 2 hours

export const redisCache = {
  async get(key: string): Promise<string | null> {
    try {
      return await client.get(key)
    } catch {
      return null
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      await client.set(key, value, { EX: TTL })
    } catch {
      // cache failure should never break the app
    }
  },

  buildKey(query: string): string {
    // normalize query for cache key
    return 'rag:' + query.toLowerCase().trim().replace(/\s+/g, '_')
  }
}