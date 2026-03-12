import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import LanguageApiService from '../../services/language-api-service';

class LearningRoute extends Component {
  state = {
    view: 'pool',
    words: [],
    language: null,
    showResults: false,
    showResetModal: false,
    correctCount: 0,
    incorrectCount: 0,
    nextWord: '',
    score: 0,
    isCorrect: true,
    original: '',
    translation: '',
    guess: '',
    error: null,
  };

  componentDidMount() {
    Promise.all([
      LanguageApiService.getLanguageAndWords(),
      LanguageApiService.getCurrentWord(),
    ]).then(([langData, wordData]) => {
      this.setState({
        words: langData.words,
        language: langData.language,
        nextWord: wordData.nextWord,
        original: wordData.nextWord,
        score: wordData.score,
        incorrectCount: wordData.incorrectCount,
        correctCount: wordData.correctCount,
      });
    }).catch(() => {
      this.setState({ error: 'Could not load data. Is the API running?' });
    });
  }

  getNextWord = () => {
    LanguageApiService.getCurrentWord()
      .then((res) => {
        this.setState({
          original: res.nextWord,
          incorrectCount: res.incorrectCount,
          correctCount: res.correctCount,
          showNextWord: false,
        });
      })
      .catch((err) => {
        console.error('Failed to get word:', err);
        this.setState({ error: 'Could not load word. Is the API running?' });
      });
  };

  handleGuess = (e) => {
    e.preventDefault();

    let guess = e.target['guess-input'].value;
    guess = guess.trim();
    this.setState({
      guess,
    });
    LanguageApiService.handleSubmitGuess(guess)
      .then((data) => {
        this.setState({
          nextWord: data.nextWord,
          score: data.score,
          incorrectCount: data.incorrectCount,
          correctCount: data.correctCount,
          isCorrect: data.isCorrect,
          showResults: true,
          translation: data.translation,
        });
      })
      .catch((err) => {
        console.error('Failed to submit guess:', err);
        this.setState({ error: 'Could not submit guess. Is the API running?' });
      });
  };

  handleResetConfirm = () => {
    LanguageApiService.resetCounts()
      .then((res) => {
        return LanguageApiService.getLanguageAndWords().then((langData) => {
          this.setState({
            view: 'pool',
            showResetModal: false,
            showResults: false,
            words: langData.words,
            language: langData.language,
            correctCount: res.correctCount,
            incorrectCount: res.incorrectCount,
            nextWord: res.nextWord,
            original: res.nextWord,
            score: res.score,
            guess: '',
            error: null,
          });
        });
      })
      .catch(() => {
        this.setState({ showResetModal: false, error: 'Reset failed. Is the API running?' });
      });
  };

  handleResetCancel = () => {
    this.setState({ showResetModal: false });
  };

  handleNextWord = () => {
    this.setState({
      showResults: false,
    });
    this.getNextWord();
  };

  renderWordPool = () => {
    const { words, score } = this.state;
    return (
      <section className='py-2'>
        <div className='text-center mb-5'>
          <div className='inline-block py-1.5 px-3.5 border-2 border-primary rounded-full text-[0.8rem] text-primary mb-5'>
            Score: <strong className='text-base'>{score}</strong>
          </div>
          <h2 className='text-[1.3rem] font-extrabold text-[#1a202c] mt-3 mb-1'>Your Word Bank</h2>
          <p className='text-[0.85rem] text-[#718096]'>{words.length} French words to master</p>
        </div>
        <div className='flex flex-wrap justify-center gap-2 p-[4px_2px] mb-5'>
          {words.map((w) => (
            <span key={w.id} className='bg-[#e9ecef] rounded-full py-1.5 px-3.5 text-[0.9rem] text-[#333] whitespace-nowrap'>{w.original}</span>
          ))}
        </div>
        <button
          className='block w-full p-3 border-none rounded-lg bg-primary text-white text-base font-semibold cursor-pointer transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0'
          onClick={() => this.setState({ view: 'guessing' })}
        >
          Start Practicing →
        </button>
      </section>
    );
  };

  showNextWord = () => {
    const { nextWord, incorrectCount, correctCount, score } = this.state;

    return (
      <section>
        <div className='text-center mb-6 relative'>
          <div className='inline-block py-1.5 px-3.5 border-2 border-primary rounded-full text-[0.8rem] text-primary mb-5'>
            Score: <strong className='text-base'>{score}</strong>
          </div>
          <div className='flex flex-col items-center gap-2 py-7 px-5 rounded-[14px] bg-white border-b-4 border-b-primary shadow-elevated'>
            <span className='text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#999]'>Translate</span>
            <span className='text-[2.2rem] font-extrabold text-[#1a202c] animate-pop-in block'>{nextWord}</span>
          </div>
        </div>

        <div className='text-center mb-5'>
          <form onSubmit={this.handleGuess}>
            <label className='text-primary mb-2.5 block font-semibold'>What's your translation?</label>
            <input
              type='text'
              className='w-4/5 p-3 border-2 border-connector rounded-lg mb-3 text-center text-base transition-[border-color,box-shadow] duration-200 block mx-auto focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20'
              name='guess-input'
              placeholder='Type your answer...'
              required
            />
            <button className='w-4/5 py-3 px-5 border-none rounded-lg bg-primary text-white text-base font-semibold cursor-pointer transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0' type='submit'>
              Submit →
            </button>
          </form>
        </div>

        <div className='flex justify-center gap-3 mt-6'>
          <div className='py-1.5 px-3.5 rounded-full text-[0.8rem] font-bold bg-green-correct-bg text-green-correct-text border-[1.5px] border-green-correct'>✓ {correctCount} correct</div>
          <div className='py-1.5 px-3.5 rounded-full text-[0.8rem] font-bold bg-red-incorrect-bg text-red-incorrect-text border-[1.5px] border-red-incorrect'>✗ {incorrectCount} incorrect</div>
        </div>
      </section>
    );
  };

  renderResults = () => {
    let { isCorrect, guess, original, translation, score } = this.state;
    return (
      <section className={cx(
        'py-8 px-6 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] my-5 mx-auto max-w-[500px] text-center border-l-[5px] transition-colors duration-300',
        isCorrect ? 'bg-green-correct-bg border-l-green-correct' : 'bg-red-incorrect-bg border-l-red-incorrect'
      )}>
        <div className={cx(
          'mb-6 text-[2rem] font-extrabold tracking-tight animate-pop-in',
          isCorrect ? 'text-green-correct-text' : 'text-red-incorrect-text'
        )}>
          {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
        </div>

        <div className='flex flex-col items-center gap-3 mb-6'>
          <div className='w-full max-w-[340px] py-3 px-4 rounded-[10px] border-2 border-connector bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex flex-col items-center gap-1'>
            <span className='text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#888]'>Word</span>
            <span className='text-[1.25rem] font-bold text-[#2d3748]'>{original}</span>
          </div>
          {!isCorrect && (
            <div className='w-full max-w-[340px] py-3 px-4 rounded-[10px] border-2 border-red-incorrect bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex flex-col items-center gap-1'>
              <span className='text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#888]'>Your answer</span>
              <span className='text-[1.25rem] font-bold text-red-incorrect-text line-through opacity-80'>{guess}</span>
            </div>
          )}
          <div className='w-full max-w-[340px] py-3 px-4 rounded-[10px] border-2 border-green-correct bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] flex flex-col items-center gap-1'>
            <span className='text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#888]'>Correct answer</span>
            <span className='text-[1.25rem] font-bold text-green-correct-text'>{translation}</span>
          </div>
        </div>

        <div className='mb-5 text-base text-[#555]'>Score: <strong className='text-[1.4rem] text-[#2d3748]'>{score}</strong></div>
        <button
          className={cx(
            'py-3 px-7 border-none rounded-lg text-base font-semibold text-white cursor-pointer transition-[filter,transform] duration-200 hover:brightness-110 hover:-translate-y-px active:translate-y-0',
            isCorrect ? 'bg-green-correct' : 'bg-orange-incorrect-btn'
          )}
          onClick={this.handleNextWord}
        >
          {isCorrect ? 'Keep it up! Next word →' : 'Try another word →'}
        </button>
      </section>
    );
  };

  render() {
    let { view, showResults, showResetModal, error } = this.state;
    return (
      <>
        <div className='flex justify-between items-center max-w-[900px] mx-auto mb-3'>
          <Link to='/' className='text-[0.85rem] font-semibold text-primary no-underline hover:underline'>← Home</Link>
          <button className='block mx-auto mb-4 py-1.5 px-4 border-[1.5px] border-red-incorrect rounded-full bg-transparent text-red-incorrect text-[0.8rem] font-semibold cursor-pointer transition-[background,color] duration-200 hover:bg-red-incorrect hover:text-white' onClick={() => this.setState({ showResetModal: true })}>
            Reset
          </button>
        </div>
        <section className='p-5 bg-linear-to-br from-[rgba(93,154,251,0.366)] to-[rgba(98,210,255,0.287)] rounded-[10px] shadow-card mx-auto mt-20 max-w-[900px]'>
          {error && <p className="text-red-incorrect text-center font-semibold">{error}</p>}
          {!error && view === 'pool' && this.renderWordPool()}
          {!error && view === 'guessing' && (showResults ? this.renderResults() : this.showNextWord())}
          {showResetModal && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[100]'>
              <div className='bg-white rounded-xl py-8 px-7 max-w-[360px] w-[90%] shadow-modal text-center'>
                <h2 className='text-[1.3rem] font-extrabold text-[#1a202c] mb-3'>Reset all counts?</h2>
                <p className='text-[0.9rem] text-[#555] mb-6 leading-relaxed'>
                  This will reset the score and all correct/incorrect counts to zero. This cannot be undone.
                </p>
                <div className='flex gap-3 justify-center'>
                  <button className='py-2.5 px-6 rounded-lg text-[0.95rem] font-semibold cursor-pointer border-none transition-[filter] duration-200 hover:brightness-[0.92] bg-[#edf2f7] text-[#4a5568]' onClick={this.handleResetCancel}>
                    Cancel
                  </button>
                  <button className='py-2.5 px-6 rounded-lg text-[0.95rem] font-semibold cursor-pointer border-none transition-[filter] duration-200 hover:brightness-[0.92] bg-red-incorrect text-white' onClick={this.handleResetConfirm}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    );
  }
}

export default LearningRoute;
