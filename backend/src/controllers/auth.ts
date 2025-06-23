import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middlewares/errorHandler'
import { logger } from '../utils/logger'
import { auth } from '../services/firebase'

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body

    const decodedToken = await auth.verifyIdToken(token)
    
    return res.json({
      status: 'success',
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    })
  } catch (error) {
    logger.error('Error verifying token:', error)
    return next(new AppError(401, 'Invalid token'))
  }
} 