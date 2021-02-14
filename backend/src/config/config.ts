import dotenv = require('dotenv');

dotenv.config();

const config = {
  dev: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging' && process.env.NODE_ENV !== 'preview',
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
};

export { config };
