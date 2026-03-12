import config from '../config';
import type { LanguageAndWordsResponse, HeadResponse, GuessResponse } from '../../../shared/types';

const LanguageApiService = {
  getLanguageAndWords(): Promise<LanguageAndWordsResponse> {
    return fetch(`${config.API_ENDPOINT}/language`).then((res) => {
      if (!res.ok) {
        return res.json().then((e) => {
          return Promise.reject(e);
        });
      } else return res.json();
    });
  },

  getCurrentWord(): Promise<HeadResponse> {
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

  handleSubmitGuess(guess: string): Promise<GuessResponse> {
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
  resetCounts(): Promise<HeadResponse> {
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
