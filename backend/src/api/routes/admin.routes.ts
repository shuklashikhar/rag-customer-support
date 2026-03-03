import { Router } from 'express'
const router = Router()

router.get('/conversations', (req, res) => {
  res.json({ success: true, message: 'admin conversations - coming soon' })
})

router.get('/feedback', (req, res) => {
  res.json({ success: true, message: 'admin feedback - coming soon' })
})

router.get('/stats', (req, res) => {
  res.json({ success: true, message: 'admin stats - coming soon' })
})

export default router