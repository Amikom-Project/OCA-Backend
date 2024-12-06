import { Request, Response, NextFunction } from 'express';

import { AuthService } from '@/services/auth-service';
import { successResponse } from '@/utils/response-success-util';
import { handleError } from '@/errors/response-error';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, password } = req.body;

      const response = await AuthService.login({ user_id, password });

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
