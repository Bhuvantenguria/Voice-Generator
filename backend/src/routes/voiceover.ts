import { Router } from 'express'
import { generateVoiceover, getVoiceovers } from '../controllers/voiceover'
import { validateRequest } from '../middlewares/validateRequest'
import { z } from 'zod'

const router = Router()

const generateVoiceoverSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(5000),
    language: z.string(),
    voice: z.string(),
    style: z.string(),
  }),
})

router.post(
  '/generate',
  validateRequest(generateVoiceoverSchema),
  generateVoiceover
)

router.get('/list', getVoiceovers)

export { router as voiceoverRoutes } 