import { Response } from 'express';

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}

function getErrorDescription(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    default:
      return 'Error';
  }
}

export function handleError(res: Response, error: unknown): void {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      status: {
        code: error.statusCode,
        description: getErrorDescription(error.statusCode),
      },
      result: error.message,
    });
  } else {
    res.status(500).json({
      status: {
        code: 500,
        description: 'Internal Server Error',
      },
      result:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}
