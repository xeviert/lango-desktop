const app = require('./app')
const { PORT } = require('./config')
const LanguageService = require('./language/language-service')

LanguageService.shuffleWords()

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
