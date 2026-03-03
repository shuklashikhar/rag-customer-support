import app from './app'
import { config } from './config/index'
import { logger } from './utils/logger'

const PORT = parseInt(config.PORT)

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`)
  logger.info(`📦 Environment: ${config.NODE_ENV}`)
})