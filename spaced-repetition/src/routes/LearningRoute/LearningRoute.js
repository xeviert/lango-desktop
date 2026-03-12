import React, { Component } from 'react';
import LanguageApiService from '../../services/language-api-service';
import '../../styling/learning.css';

class LearningRoute extends Component {
  state = {
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
    this.getFirstWord();
  }

  getFirstWord = () => {
    LanguageApiService.getCurrentWord()
      .then((res) => {
        this.setState({
          nextWord: res.nextWord,
          original: res.nextWord,
          score: res.score,
          incorrectCount: res.incorrectCount,
          correctCount: res.correctCount,
          showResults: false,
        });
      })
      .catch((err) => {
        console.error('Failed to get word:', err);
        this.setState({ error: 'Could not load word. Is the API running?' });
      });
  };

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
        this.setState({
          showResetModal: false,
          showResults: false,
          correctCount: res.correctCount,
          incorrectCount: res.incorrectCount,
          nextWord: res.nextWord,
          original: res.nextWord,
          score: res.score,
          guess: '',
          error: null,
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

  showNextWord = () => {
    const { nextWord, incorrectCount, correctCount, score } = this.state;

    return (
      <section>
        <button className='reset-btn' onClick={() => this.setState({ showResetModal: true })}>
          Reset Count
        </button>
        <div className='top-section'>
          <div className='score-badge'>Score: <strong>{score}</strong></div>
          <div className='challenge-card'>
            <span className='challenge-eyebrow'>Translate</span>
            <span className='current-word-display'>{nextWord}</span>
          </div>
        </div>

        <div className='form-section'>
          <form onSubmit={this.handleGuess}>
            <label>What's your translation?</label>
            <input
              type='text'
              className='learn-guess-input'
              name='guess-input'
              placeholder='Type your answer...'
              required
            />
            <button className='answer-sub-btn' type='submit'>
              Submit →
            </button>
          </form>
        </div>

        <div className='stats-row'>
          <div className='stat-chip stat-chip--correct'>✓ {correctCount} correct</div>
          <div className='stat-chip stat-chip--incorrect'>✗ {incorrectCount} incorrect</div>
        </div>
      </section>
    );
  };

  renderResults = () => {
    let { isCorrect, guess, original, translation, score } = this.state;
    return (
      <section className={`result-page ${isCorrect ? 'result-page--correct' : 'result-page--incorrect'}`}>
        <div className={`response-title ${isCorrect ? 'response-title--correct' : 'response-title--incorrect'}`}>
          {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
        </div>

        <div className='word-breakdown'>
          <div className='word-pill word-pill--original'>
            <span className='word-pill-label'>Word</span>
            <span className='word-pill-value'>{original}</span>
          </div>
          {!isCorrect && (
            <div className='word-pill word-pill--wrong'>
              <span className='word-pill-label'>Your answer</span>
              <span className='word-pill-value word-pill-strikethrough'>{guess}</span>
            </div>
          )}
          <div className='word-pill word-pill--correct'>
            <span className='word-pill-label'>Correct answer</span>
            <span className='word-pill-value'>{translation}</span>
          </div>
        </div>

        <div className='result-score'>Score: <strong>{score}</strong></div>
        <button
          className={`next-word-btn ${isCorrect ? 'next-word-btn--correct' : 'next-word-btn--incorrect'}`}
          onClick={this.handleNextWord}
        >
          {isCorrect ? 'Keep it up! Next word →' : 'Try another word →'}
        </button>
      </section>
    );
  };

  render() {
    let { showResults, showResetModal, error } = this.state;
    return (
      <section className='learning-route-body'>
        {error && <p className="error-msg">{error}</p>}
        {!error && (showResults ? this.renderResults() : this.showNextWord())}
        {showResetModal && (
          <div className='modal-overlay'>
            <div className='modal'>
              <h2 className='modal-title'>Reset all counts?</h2>
              <p className='modal-body'>
                This will reset the score and all correct/incorrect counts to zero. This cannot be undone.
              </p>
              <div className='modal-actions'>
                <button className='modal-btn modal-btn--cancel' onClick={this.handleResetCancel}>
                  Cancel
                </button>
                <button className='modal-btn modal-btn--confirm' onClick={this.handleResetConfirm}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}

export default LearningRoute;
