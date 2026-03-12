import app from './app'
import config from './config'
import LanguageService from './language/language-service'

LanguageService.shuffleWords()

app.listen(config.PORT, () => {
  console.log(`Server listening at http://localhost:${config.PORT}`)
})
