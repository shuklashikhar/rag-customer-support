import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { documentController } from '../controllers/document.controller'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'

// Store uploads in /tmp folder
const upload = multer({
  dest: path.join(process.cwd(), 'tmp'),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/csv']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and CSV files allowed'))
    }
  }
})

const router = Router()

router.post(
  '/upload',
  authenticate,
  authorize('ADMIN'),
  upload.single('file'),
  documentController.upload
)

router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  documentController.list
)

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  documentController.delete
)

export default router