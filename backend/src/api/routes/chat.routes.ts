import { Router } from 'express'
const router = Router()

router.post('/', (req, res) => {
  res.json({ success: true, message: 'chat - coming soon' })
})

export default router