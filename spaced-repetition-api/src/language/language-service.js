const fs = require('fs')
const { DATA_FILE, SEED_FILE } = require('../config')
const { isCloseEnough } = require('./fuzzy-match')

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

const LanguageService = {
  getUsersLanguage() {
    const data = readData()
    return data.language
  },

  getLanguageWords() {
    const data = readData()
    return data.words
  },

  getHead() {
    const data = readData()
    const word = data.words[0]
    return {
      nextWord: word.original,
      correctCount: word.correct_count,
      incorrectCount: word.incorrect_count,
      score: data.language.total_score,
    }
  },

  submitGuess(guess) {
    const data = readData()
    const word = data.words[0]
    const isCorrect = isCloseEnough(guess, word.translation)

    if (isCorrect) {
      word.correct_count++
      data.language.total_score++
    } else {
      word.incorrect_count++
    }

    const threshold = data.language.total_score >= 340 ? 8 : 4;
    if (word.correct_count >= threshold) {
      data.words.shift()
    } else {
      data.words.shift()
      data.words.push(word)
    }

    writeData(data)

    if (data.words.length === 0) {
      return { allWordsLearned: true, score: data.language.total_score }
    }

    const next = data.words[0]
    return {
      nextWord: next.original,
      correctCount: next.correct_count,
      incorrectCount: next.incorrect_count,
      score: data.language.total_score,
      translation: word.translation,
      isCorrect,
    }
  },

  resetCounts() {
    const data = readData()
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'))

    data.words = seed.map(w => ({
      ...w,
      correct_count: 0,
      incorrect_count: 0,
    }))

    for (let i = data.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data.words[i], data.words[j]] = [data.words[j], data.words[i]]
    }

    data.language.total_score = 0
    writeData(data)

    const word = data.words[0]
    return {
      nextWord: word.original,
      correctCount: word.correct_count,
      incorrectCount: word.incorrect_count,
      score: 0,
    }
  },

  shuffleWords() {
    const data = readData()
    const words = [...data.words]
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]]
    }
    data.words = words
    writeData(data)
  },
}

module.exports = LanguageService
