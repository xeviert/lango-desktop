import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LanguageApiService from '../../services/language-api-service';
import '../../styling/dashboard.css';

class DashboardRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      practiceWords: '',
      error: null,
    };
  }

  componentDidMount() {
    LanguageApiService.getLanguageAndWords()
      .then((data) => {
        this.setState({ language: data.language });
        this.renderWords(data.words);
      })
      .catch((err) => {
        console.error('Failed to load language data:', err);
        this.setState({ error: 'Could not load words. Is the API running?' });
      });
  }

  renderWords = (words) => {
    let practiceWords = words.map((word) => (
      <span key={word.id} className='word-bank-pill'>
        {word.original}
      </span>
    ));
    this.setState({ practiceWords });
  };

  getLanguage = () => {
    return this.state.language == null ? null : this.state.language.name;
  };

  getTotalCorrect = () => {
    return this.state.language == null ? null : this.state.language.total_score;
  };

  render() {
    const { practiceWords } = this.state;

    return (
      <section className='dashboard-section'>
        {this.state.error && <p className="error-msg">{this.state.error}</p>}
        <h2>Your language: {this.getLanguage()}</h2>

        <div className='dashboard-body'>
          <h3>Words to practice</h3>
          <div className='word-bank-grid'>{practiceWords}</div>
        </div>

        <div className='dashboard-footer'>
          <div className='total-correct'>
            Total correct answers: {this.getTotalCorrect()}
          </div>
          <Link to='/learn'>
            <button className='start-btn'>Start Practicing</button>
          </Link>
        </div>
      </section>
    );
  }
}

export default DashboardRoute;
