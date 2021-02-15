// error.middleware.ts
/**
 * This is the doc comment for error.middleware.ts
 * @packageDocumentation
 * @module errorMiddleware
 */

import boom = require('@hapi/boom');
// const { config } = require('../../config');
import { config } from '../../config/config';

/**
 * Function for return the details of the error in dev envinronment
 * @param error Error in route
 * @param stack Stack of errors specified
 */

function withErrorStack(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }

  return error;
}

function logErrors(err, req, res, next) {
  console.log(err);
  next(err);
}

/**
 * Function for wrap the errors
 * @param err Error in route
 * @param req Route request
 * @param res Route respons
 * @param next Middleware next
 */

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err));
  }

  next(err);
}

/**
 * Function for handler the errors in request of routes
 * @param err Error in route
 * @param req Route request
 * @param res Route respons
 * @param next Middleware next
 */

function errorHandler(err, req, res, next) { // eslint-disable-line
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

export {
  logErrors,
  wrapErrors,
  errorHandler,

};
