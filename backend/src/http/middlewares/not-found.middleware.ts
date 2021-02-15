// not-found.middleware.ts
/**
 * This is the doc comment for not-found.middleware.ts
 * @packageDocumentation
 * @module notFoundMiddleware
 */

const boom = require('@hapi/boom');

/**
 * Function for handle request for routes not existing
 * @param req The route request
 * @param res The route response
 */

function notFoundHandler(req, res) {
  const {
    output: { statusCode, payload },
  } = boom.notFound();

  res.status(statusCode).json(payload);
}

export { notFoundHandler };
