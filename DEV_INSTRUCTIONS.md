# Running the Development Server

## Prerequisites

- Node.js installed
- Dependencies installed in both directories:
  ```bash
  cd spaced-repetition-api && npm install
  cd ../spaced-repetition && npm install
  ```

## Quick Start

Run the development server from the `lango` directory:

```bash
./dev.sh
```

Or with bash explicitly:

```bash
bash dev.sh
```

## What It Does

The script starts two processes in parallel:

1. **API Server** (`spaced-repetition-api/`)
   - Runs on `npm run dev` (nodemon with auto-reload)
   - Serves the backend API

2. **React Client** (`spaced-repetition/`)
   - Runs on `npm start` (Vite dev server)
   - Waits 3 seconds for the API to initialize before starting

## Stopping the Servers

Press **Ctrl+C** to stop both processes.

## What to Expect

Once running, you should see output like:
```
Starting API server...
Waiting for API to initialize...
Starting client...

✓ API server started (PID: [number])
✓ Client started (PID: [number])

To stop both processes, press Ctrl+C
```

The client typically opens in your default browser (check your terminal output for the URL).

## Troubleshooting

- **Port already in use**: Another process is using the required ports. Kill it or change the port in the API/client config.
- **API didn't start**: Check `spaced-repetition-api/` for errors with `npm run dev` directly.
- **Client didn't start**: Check `spaced-repetition/` for errors with `npm start` directly.
