import config from '../config';

const LanguageApiService = {
  getLanguageAndWords() {
    return fetch(`${config.API_ENDPOINT}/language`).then((res) => {
      if (!res.ok) {
        return res.json().then((e) => {
          return Promise.reject(e);
        });
      } else return res.json();
    });
  },

  getCurrentWord() {
    return fetch(`${config.API_ENDPOINT}/language/head`).then((res) => {
      if (!res.ok) {
        return res.json().then((e) => {
          return Promise.reject(e);
        });
      } else {
        return res.json();
      }
    });
  },

  handleSubmitGuess(guess) {
    return fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ guess }),
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((e) => {
          return Promise.reject(e);
        });
      } else {
        return res.json();
      }
    });
  },
  resetCounts() {
    return fetch(`${config.API_ENDPOINT}/language/reset`, {
      method: 'POST',
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((e) => Promise.reject(e));
      } else return res.json();
    });
  },
};

export default LanguageApiService;
