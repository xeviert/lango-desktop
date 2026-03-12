// Data model (mirrors data.json)
export interface Word {
  id: number;
  original: string;
  translation: string;
  correct_count: number;
  incorrect_count: number;
}

export interface Language {
  name: string;
  total_score: number;
}

export interface DataFile {
  language: Language;
  words: Word[];
}

export interface SeedWord {
  id: number;
  original: string;
  translation: string;
}

// API responses
export interface HeadResponse {
  nextWord: string;
  correctCount: number;
  incorrectCount: number;
  score: number;
}

export interface GuessResponse extends HeadResponse {
  translation: string;
  isCorrect: boolean;
}

export interface AllWordsLearnedResponse {
  allWordsLearned: true;
  score: number;
}

export interface GuessRequestBody {
  guess: string;
}

export interface LanguageAndWordsResponse {
  language: Language;
  words: Word[];
}
