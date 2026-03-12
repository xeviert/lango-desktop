import fs from 'fs'
import config from '../config'
import { isCloseEnough } from './fuzzy-match'
import type { DataFile, SeedWord, HeadResponse, GuessResponse, AllWordsLearnedResponse } from '../../../shared/types'

function readData(): DataFile {
  return JSON.parse(fs.readFileSync(config.DATA_FILE, 'utf8'))
}

function writeData(data: DataFile): void {
  fs.writeFileSync(config.DATA_FILE, JSON.stringify(data, null, 2))
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

  getHead(): HeadResponse {
    const data = readData()
    const word = data.words[0]
    return {
      nextWord: word.original,
      correctCount: word.correct_count,
      incorrectCount: word.incorrect_count,
      score: data.language.total_score,
    }
  },

  submitGuess(guess: string): GuessResponse | AllWordsLearnedResponse {
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
      return { allWordsLearned: true as const, score: data.language.total_score }
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

  resetCounts(): HeadResponse {
    const data = readData()
    const seed: SeedWord[] = JSON.parse(fs.readFileSync(config.SEED_FILE, 'utf8'))

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

  shuffleWords(): void {
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

export default LanguageService
