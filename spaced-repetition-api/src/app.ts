import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import config from './config'
import errorHandler from './middleware/error-handler'
import languageRouter from './language/language-router'

const app = express()

app.use(
  morgan(config.NODE_ENV === 'production' ? 'tiny' : 'common', {
    skip: () => config.NODE_ENV === 'test',
  }),
)
app.use(cors())
app.use(helmet())

app.use('/api/language', languageRouter)

app.get('/', (_req, res) => {
  res.send('Hello, Lango!')
})

app.use(errorHandler)

export default app
