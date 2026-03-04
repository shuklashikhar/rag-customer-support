import app from './app'
import { config } from './config/index'
import { logger } from './utils/logger'
import { connectDatabase } from './config/database'
import { connectRedis } from './cache/redis.cache'

const PORT = parseInt(config.PORT)

const start = async () => {
  await connectDatabase()
  await connectRedis()

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`)
    logger.info(`📦 Environment: ${config.NODE_ENV}`)
  })
}

start()