const express = require('express')
const LanguageService = require('./language-service')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter.use(async (req, res, next) => {
  try {
    const language = LanguageService.getUsersLanguage()
    if (!language)
      return res.status(404).json({ error: `No language configured` })
    req.language = language
    next()
  } catch (error) {
    next(error)
  }
})

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = LanguageService.getLanguageWords()
    res.json({
      language: req.language,
      words,
    })
    next()
  } catch (error) {
    next(error)
  }
})

languageRouter.get('/head', async (req, res, next) => {
  try {
    const head = LanguageService.getHead()
    res.status(200).send(head)
  } catch (error) {
    next(error)
  }
})

languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  try {
    const { guess } = req.body
    if (!guess)
      return res.status(400).send({ error: `Missing 'guess' in request body` })

    const result = LanguageService.submitGuess(guess)
    res.send(result)
  } catch (error) {
    next(error)
  }
})

languageRouter.post('/reset', async (req, res, next) => {
  try {
    const result = LanguageService.resetCounts()
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = languageRouter
