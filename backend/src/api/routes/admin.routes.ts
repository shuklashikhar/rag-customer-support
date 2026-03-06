import { Router } from 'express'
import { adminController } from '../controllers/admin.controller'
import { authenticate } from '../middlewares/authenticate.middleware'
import { authorize } from '../middlewares/authorize.middleware'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.get('/conversations', adminController.getAllConversations)
router.get('/feedback', adminController.getAllFeedback)
router.get('/stats', adminController.getStats)

export default router