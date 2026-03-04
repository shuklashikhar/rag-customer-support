import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.middleware'

const router = Router()

router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'feedback - coming soon' })
})

export default router