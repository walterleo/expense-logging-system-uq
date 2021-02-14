import { Request, Response } from 'express';

const statusMessages = {
  200: 'Done',
  201: 'Created',
  400: 'Invalid format',
  500: 'Internal error',
};

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
