// db.ts
/**
 * This is the doc comment for db.ts
 * @packageDocumentation
 * @module db
 */

import mongoose = require('mongoose');
import { config } from '../config/config';

mongoose.Promise = global.Promise;

// CONNECT DB WITH MONGOOSE
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const PORT = encodeURIComponent(config.dbPort);

/**
 * Function for connect the api with the database mongo
 */
async function connect() {
  const AUTH = USER && PASSWORD ? `${USER}:${PASSWORD}@` : '';
  const url = process.env.MONGO_URL || `mongodb://${AUTH}${config.dbHost}:${PORT}/${config.dbName}`;

  try {
    console.log('db connection url', url);

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('db connection successfully!');
  } catch (err) {
    console.log('db connection url', url);
    console.log('db connection error', err);
  }
}

export { connect };
