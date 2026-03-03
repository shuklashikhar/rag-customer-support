import { Router } from 'express'
const router = Router()

router.post('/register', (req, res) => {
  res.json({ success: true, message: 'register - coming soon' })
})

router.post('/login', (req, res) => {
  res.json({ success: true, message: 'login - coming soon' })
})

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'logout - coming soon' })
})

router.get('/me', (req, res) => {
  res.json({ success: true, message: 'me - coming soon' })
})

export default router