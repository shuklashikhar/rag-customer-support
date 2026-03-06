import { Router } from 'express'
import { conversationController } from '../controllers/conversation.controller'
import { authenticate } from '../middlewares/authenticate.middleware'

const router = Router()

router.use(authenticate)

router.get('/', conversationController.list)
router.get('/:id', conversationController.getOne)
router.delete('/:id', conversationController.delete)

export default router