import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'

const router = Router()

// All admin routes require login + admin role
router.use(authenticate)
router.use(authorize('ADMIN'))

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