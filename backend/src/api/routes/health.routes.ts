import { Router } from 'express'
import { prisma } from '../../config/database'
import { config } from '../../config/index'
import { createClient } from 'redis'

const router = Router()

router.get('/', async (req, res) => {
  const health: Record<string, string> = {}

  // Check Postgres
  try {
    await prisma.$queryRaw`SELECT 1`
    health.postgres = 'healthy'
  } catch {
    health.postgres = 'unhealthy'
  }

  // Check Redis
  try {
    const redis = createClient({ url: config.REDIS_URL })
    await redis.connect()
    await redis.ping()
    await redis.disconnect()
    health.redis = 'healthy'
  } catch {
    health.redis = 'unhealthy'
  }

  // Check Ollama
  try {
    const res2 = await fetch(`${config.OLLAMA_BASE_URL}`)
    health.ollama = res2.ok ? 'healthy' : 'unhealthy'
  } catch {
    health.ollama = 'unhealthy'
  }

  // Check ChromaDB
  try {
    const res3 = await fetch(
      `${config.CHROMA_URL}/api/v2/tenants/default_tenant`
    )
    health.chromadb = res3.ok ? 'healthy' : 'unhealthy'
  } catch {
    health.chromadb = 'unhealthy'
  }

  const allHealthy = Object.values(health).every(v => v === 'healthy')

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    data: { health },
    timestamp: new Date().toISOString()
  })
})

router.get('/test-nomic', async (req, res) => {
  try {
    const response = await fetch('https://api-atlas.nomic.ai/v1/embedding/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NOMIC_API_KEY}`
      },
      body: JSON.stringify({
        texts: ['test'],
        model: 'nomic-embed-text-v1.5',
        task_type: 'search_document'
      })
    })
    const data = await response.json()
    res.json({ success: response.ok, status: response.status, data })
  } catch (err: any) {
    res.json({ success: false, error: err.message })
  }
})

export default router