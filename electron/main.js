const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;

// Determine data file path
let dataFilePath;
if (isDev) {
  dataFilePath = path.join(__dirname, '..', 'spaced-repetition-api', 'data', 'data.json');
} else {
  dataFilePath = path.join(app.getPath('userData'), 'data.json');

  // Copy seed data on first launch
  if (!fs.existsSync(dataFilePath)) {
    const seedPath = path.join(process.resourcesPath, 'seed-data.json');
    fs.copyFileSync(seedPath, dataFilePath);
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('http://127.0.0.1:3001');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  if (isDev) {
    // In dev mode, the API runs as a separate tsx process via concurrently.
    // Just create the window — no need to require backend modules.
    createWindow();
  } else {
    // In production, load the compiled backend
    const apiBasePath = path.join(__dirname, '..', 'spaced-repetition-api', 'dist', 'spaced-repetition-api', 'src');

    const config = require(path.join(apiBasePath, 'config.js'));
    config.DATA_FILE = dataFilePath;

    const expressApp = require(path.join(apiBasePath, 'app.js')).default;
    const LanguageService = require(path.join(apiBasePath, 'language', 'language-service.js')).default;

    const express = require(path.join(
      __dirname, '..', 'spaced-repetition-api', 'node_modules', 'express'
    ));
    const frontendPath = path.join(__dirname, '..', 'spaced-repetition', 'dist');
    expressApp.use(express.static(frontendPath));

    // SPA fallback: serve index.html for non-API routes
    expressApp.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    // Shuffle words on startup
    LanguageService.shuffleWords();

    // Start Express server
    const PORT = 3001;
    expressApp.listen(PORT, '127.0.0.1', () => {
      console.log(`API server running on http://127.0.0.1:${PORT}`);
    });

    createWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
