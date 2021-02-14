import express = require('express');
import { routes } from './http/routes';
import {config} from "./config/config";
import cors = require('cors');

import { connect as db } from './server/db';

import { notFoundHandler } from './http/middlewares/not-found.middleware';
import { logErrors, wrapErrors, errorHandler } from './http/middlewares/error.middleware';

// Create a new express application instance
const app: express.Application = express();
db(); // connect to db

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
}));
routes(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Catch 404
app.use(notFoundHandler);
// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
