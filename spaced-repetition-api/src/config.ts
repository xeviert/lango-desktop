import path from 'path'

const config = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_FILE: path.join(__dirname, '../data/data.json'),
  SEED_FILE: path.join(__dirname, '../data/seed.json'),
}

export = config
