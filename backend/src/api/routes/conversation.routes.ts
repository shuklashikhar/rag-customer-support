import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.middleware'

const router = Router()

router.use(authenticate)

router.get('/', (req, res) => {
  res.json({ success: true, message: 'list conversations - coming soon' })
})

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'get conversation - coming soon' })
})

router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'delete conversation - coming soon' })
})

export default router