import { useReducer, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import LanguageApiService from '@/services/language-api-service';
import { WordPoolView } from './components/WordPoolView';
import { GuessingView } from './components/GuessingView';
import { ResultsView } from './components/ResultsView';
import { ResetDialog } from './components/ResetDialog';
import type { Word, Language } from '../../../../shared/types';

interface LearningState {
  view: 'pool' | 'guessing';
  words: Word[];
  language: Language | null;
  showResults: boolean;
  showResetModal: boolean;
  correctCount: number;
  incorrectCount: number;
  nextWord: string;
  score: number;
  previousScore: number;
  isCorrect: boolean;
  original: string;
  translation: string;
  guess: string;
  error: string | null;
  streak: number;
}

type LearningAction =
  | { type: 'LOAD_SUCCESS'; words: Word[]; language: Language; nextWord: string; score: number; correctCount: number; incorrectCount: number }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_VIEW'; view: 'pool' | 'guessing' }
  | { type: 'SET_GUESS'; guess: string }
  | { type: 'GUESS_RESULT'; nextWord: string; score: number; correctCount: number; incorrectCount: number; isCorrect: boolean; translation: string }
  | { type: 'NEXT_WORD'; original: string; correctCount: number; incorrectCount: number }
  | { type: 'SHOW_RESET_MODAL'; show: boolean }
  | { type: 'RESET_SUCCESS'; words: Word[]; language: Language; nextWord: string; score: number; correctCount: number; incorrectCount: number }
  | { type: 'RESET_ERROR'; error: string };

const initialState: LearningState = {
  view: 'pool',
  words: [],
  language: null,
  showResults: false,
  showResetModal: false,
  correctCount: 0,
  incorrectCount: 0,
  nextWord: '',
  score: 0,
  previousScore: 0,
  isCorrect: true,
  original: '',
  translation: '',
  guess: '',
  error: null,
  streak: 0,
};

function reducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return {
        ...state,
        words: action.words,
        language: action.language,
        nextWord: action.nextWord,
        original: action.nextWord,
        score: action.score,
        correctCount: action.correctCount,
        incorrectCount: action.incorrectCount,
        error: null,
      };
    case 'LOAD_ERROR':
      return { ...state, error: action.error };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'SET_GUESS':
      return { ...state, guess: action.guess };
    case 'GUESS_RESULT':
      return {
        ...state,
        nextWord: action.nextWord,
        previousScore: state.score,
        score: action.score,
        correctCount: action.correctCount,
        incorrectCount: action.incorrectCount,
        isCorrect: action.isCorrect,
        translation: action.translation,
        showResults: true,
        streak: action.isCorrect ? state.streak + 1 : 0,
      };
    case 'NEXT_WORD':
      return {
        ...state,
        showResults: false,
        original: action.original,
        correctCount: action.correctCount,
        incorrectCount: action.incorrectCount,
      };
    case 'SHOW_RESET_MODAL':
      return { ...state, showResetModal: action.show };
    case 'RESET_SUCCESS':
      return {
        ...initialState,
        words: action.words,
        language: action.language,
        nextWord: action.nextWord,
        original: action.nextWord,
        score: action.score,
        correctCount: action.correctCount,
        incorrectCount: action.incorrectCount,
      };
    case 'RESET_ERROR':
      return { ...state, showResetModal: false, error: action.error };
    default:
      return state;
  }
}

export default function LearningRoute() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const stored = localStorage.getItem('lango-audio-enabled');
    return stored === null ? true : stored === 'true';
  });

  const handleToggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('lango-audio-enabled', String(next));
      if (!next) speechSynthesis.cancel();
      return next;
    });
  }, []);

  useEffect(() => {
    Promise.all([
      LanguageApiService.getLanguageAndWords(),
      LanguageApiService.getCurrentWord(),
    ])
      .then(([langData, wordData]) => {
        dispatch({
          type: 'LOAD_SUCCESS',
          words: langData.words,
          language: langData.language,
          nextWord: wordData.nextWord,
          score: wordData.score,
          correctCount: wordData.correctCount,
          incorrectCount: wordData.incorrectCount,
        });
      })
      .catch(() => {
        dispatch({ type: 'LOAD_ERROR', error: 'Could not load data. Is the API running?' });
      });
  }, []);

  const handleGuess = useCallback((guess: string) => {
    dispatch({ type: 'SET_GUESS', guess });
    LanguageApiService.handleSubmitGuess(guess)
      .then((data) => {
        dispatch({
          type: 'GUESS_RESULT',
          nextWord: data.nextWord,
          score: data.score,
          correctCount: data.correctCount,
          incorrectCount: data.incorrectCount,
          isCorrect: data.isCorrect,
          translation: data.translation,
        });
      })
      .catch(() => {
        dispatch({ type: 'LOAD_ERROR', error: 'Could not submit guess. Is the API running?' });
      });
  }, []);

  const handleNextWord = useCallback(() => {
    LanguageApiService.getCurrentWord()
      .then((res) => {
        dispatch({
          type: 'NEXT_WORD',
          original: res.nextWord,
          correctCount: res.correctCount,
          incorrectCount: res.incorrectCount,
        });
      })
      .catch(() => {
        dispatch({ type: 'LOAD_ERROR', error: 'Could not load word. Is the API running?' });
      });
  }, []);

  const handleResetConfirm = useCallback(() => {
    LanguageApiService.resetCounts()
      .then((res) => {
        return LanguageApiService.getLanguageAndWords().then((langData) => {
          dispatch({
            type: 'RESET_SUCCESS',
            words: langData.words,
            language: langData.language,
            nextWord: res.nextWord,
            score: res.score,
            correctCount: res.correctCount,
            incorrectCount: res.incorrectCount,
          });
        });
      })
      .catch(() => {
        dispatch({ type: 'RESET_ERROR', error: 'Reset failed. Is the API running?' });
      });
  }, []);

  const { view, showResults, showResetModal, error, words, score, nextWord, correctCount, incorrectCount, streak, isCorrect, guess, original, translation, previousScore } = state;

  return (
    <>
      <div className="flex justify-between items-center max-w-[900px] mx-auto px-4 mt-4 mb-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Home
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-red-incorrect text-red-incorrect hover:bg-red-incorrect hover:text-white"
          onClick={() => dispatch({ type: 'SHOW_RESET_MODAL', show: true })}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>

      <section className="p-5 bg-gradient-to-br from-blue-400/[0.15] to-teal-300/[0.12] rounded-xl shadow-card mx-auto mt-6 max-w-[900px]">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && view === 'pool' && (
          <WordPoolView
            words={words}
            score={score}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
            onStartPractice={() => dispatch({ type: 'SET_VIEW', view: 'guessing' })}
          />
        )}

        {!error && view === 'guessing' && !showResults && (
          <GuessingView
            nextWord={nextWord}
            score={score}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            streak={streak}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
            onGuess={handleGuess}
          />
        )}

        {!error && view === 'guessing' && showResults && (
          <ResultsView
            isCorrect={isCorrect}
            guess={guess}
            original={original}
            translation={translation}
            score={score}
            previousScore={previousScore}
            streak={streak}
            onNext={handleNextWord}
          />
        )}
      </section>

      <ResetDialog
        open={showResetModal}
        onConfirm={handleResetConfirm}
        onCancel={() => dispatch({ type: 'SHOW_RESET_MODAL', show: false })}
      />
    </>
  );
}
