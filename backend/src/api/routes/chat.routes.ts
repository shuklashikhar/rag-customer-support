import { Router } from 'express'
import { chatController } from '../controllers/chat.controller'
import { authenticate } from '../middlewares/authenticate.middleware'
import { validate } from '../middlewares/validate.middleware'
import { chatSchema } from '../validators/chat.validator'

const router = Router()

router.post(
  '/',
  authenticate,
  validate(chatSchema),
  chatController.chat
)

export default router