# Lango

A French vocabulary learning app that uses spaced repetition to help you memorize words effectively. Built as a desktop app with Electron, featuring a React frontend and Express API backend.

## Tech Stack

- **Frontend:** React 19, Vite 6, TypeScript, Tailwind CSS 4
- **Backend:** Express 5, TypeScript, JSON file storage
- **Desktop:** Electron 35, electron-builder
- **UI:** Radix UI, Framer Motion, Lucide icons
- **Audio:** Google Translate TTS for word pronunciation

## Project Structure

```
lango/
├── spaced-repetition/        # React frontend (Vite)
├── spaced-repetition-api/    # Express backend
│   ├── src/language/         # Spaced repetition engine, fuzzy matching
│   └── data/                 # JSON data files (words, seed)
├── electron/                 # Electron main process
├── shared/                   # Shared TypeScript types
├── dev.sh / dev.bat          # Dev launch scripts
└── package.json              # Root config, Electron builder
```

## Getting Started

### Prerequisites

- Node.js >= 18

### Install

```bash
npm install
```

This runs `postinstall` to install dependencies in both `spaced-repetition/` and `spaced-repetition-api/`.

### Running in Development

**Quick start (recommended):**

```bash
# Windows
dev.bat

# Linux/Mac
./dev.sh
```

These scripts start the API server, wait for it to initialize, then start the Vite dev server.

**With Electron:**

```bash
npm run dev
```

This uses `concurrently` to launch the frontend, backend, and Electron window together.

**Manual (two terminals):**

```bash
# Terminal 1 — API (port 3001)
cd spaced-repetition-api
npm run dev

# Terminal 2 — Frontend (port 5173)
cd spaced-repetition
npm start
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/language` | Returns language info and all words |
| `GET` | `/api/language/head` | Returns the next word to practice |
| `POST` | `/api/language/guess` | Submit a guess (`{ "guess": "..." }`) |
| `POST` | `/api/language/reset` | Reset all progress and reshuffle words |

### Response Examples

**GET /api/language/head**
```json
{ "nextWord": "bonjour", "correctCount": 3, "incorrectCount": 1, "score": 42 }
```

**POST /api/language/guess**
```json
{ "nextWord": "merci", "correctCount": 1, "incorrectCount": 0, "score": 43, "translation": "hello", "isCorrect": true }
```

## Building for Production

```bash
npm run dist
```

This compiles the backend TypeScript, builds the frontend with Vite, and packages everything into an Electron installer (NSIS on Windows). Output goes to `release/`.

## How It Works

### Spaced Repetition

Words are stored in a queue. The word at the front is presented to the user. After each guess:

- **Correct:** increment correct count and score
- **Incorrect:** increment incorrect count

A word must reach a correct-guess threshold before it's removed from the queue:
- **Score < 340:** 4 correct guesses needed
- **Score >= 340:** 8 correct guesses needed (harder as you progress)

Words that haven't met the threshold are rotated to the back of the queue. The queue is shuffled on startup and on reset.

### Fuzzy Matching

Guesses are validated using Levenshtein distance, allowing small typos:

| Answer length | Allowed errors |
|---------------|---------------|
| 1-3 characters | 0 (exact match) |
| 4-7 characters | 1 |
| 8+ characters | 2 |

Leading "to " is stripped and comparison is case-insensitive.
