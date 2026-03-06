import { Router } from 'express'
import { feedbackController } from '../controllers/feedback.controller'
import { authenticate } from '../middlewares/authenticate.middleware'
import { validate } from '../middlewares/validate.middleware'
import { feedbackSchema } from '../validators/feedback.validator'

const router = Router()

router.post(
  '/',
  authenticate,
  validate(feedbackSchema),
  feedbackController.create
)

export default router