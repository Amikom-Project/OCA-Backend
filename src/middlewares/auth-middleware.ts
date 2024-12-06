import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { UnauthorizedError } from '@/errors/response-error';

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export class AuthMiddleware {
  static verifyToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError(
          'Token tidak ditemukan atau format tidak valid!'
        );
      }

      const token = authHeader.split(' ')[1];

      const secretKey = process.env.JWT_SECRET_KEY || '';
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          throw new UnauthorizedError(
            'Token tidak valid atau telah kedaluwarsa!'
          );
        }

        req.user = decoded;
        next();
      });
    } catch (error) {
      next(error);
    }
  }
}
