import { Request, Response, NextFunction } from 'express'
import config from '../config'

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const response =
    config.NODE_ENV === 'production'
      ? { error: 'Server error' }
      : (console.error(error), { error: error.message, details: error })

  res.status(500).json(response)
}

export default errorHandler
