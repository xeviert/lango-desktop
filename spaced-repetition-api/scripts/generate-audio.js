#!/usr/bin/env node
// Run once: node scripts/generate-audio.js
// Generates MP3s for all French words into spaced-repetition/public/audio/

const fs = require('fs');
const https = require('https');
const path = require('path');
const googleTTS = require('google-tts-api');

const DATA_FILE = path.join(__dirname, '../data/data.json');
const OUTPUT_DIR = path.join(__dirname, '../../spaced-repetition/public/audio');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const words = data.words.map((w) => w.original);

  console.log(`Generating audio for ${words.length} words...`);

  for (const word of words) {
    const filename = `${encodeURIComponent(word)}.mp3`;
    const dest = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(dest)) {
      console.log(`  skip  ${word}`);
      continue;
    }

    try {
      const url = googleTTS.getAudioUrl(word, { lang: 'fr', slow: true, host: 'https://translate.google.com' });
      await download(url, dest);
      console.log(`  ok    ${word}`);
    } catch (err) {
      console.error(`  FAIL  ${word}: ${err.message}`);
    }

    // small delay to avoid hammering the endpoint
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
