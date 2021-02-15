// responses.ts
/**
 * This is the doc comment for responses.ts
 * @packageDocumentation
 * @module response
 */

import { Request, Response } from 'express';

const statusMessages = {
  200: 'Done',
  201: 'Created',
  400: 'Invalid format',
  500: 'Internal error',
};

/**
 * Function to handle the response in routes
 * @param req route request
 * @param res route response
 * @param data Data response in the route
 * @param status status of the request
 * @param descriptiveMessage Message descriptive for response
 */
function success(req: Request, res: Response, data: unknown,
  status: number, descriptiveMessage: string) {
  let statusCode = status;

  if (!statusCode) {
    statusCode = 200;
  }

  res.status(statusCode).send({
    statusCode: statusCode,
    error: '',
    // @ts-ignore
    data: data || statusMessages[statusCode],
    message: descriptiveMessage,
  });
}

export { success };
