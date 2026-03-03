import { Router } from 'express'
const router = Router()

router.post('/upload', (req, res) => {
  res.json({ success: true, message: 'upload - coming soon' })
})

router.get('/', (req, res) => {
  res.json({ success: true, message: 'list docs - coming soon' })
})

router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'delete doc - coming soon' })
})

export default router