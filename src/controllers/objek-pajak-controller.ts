import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { ObjekPajakService } from '@/services/objek-pajak-service';
import { successResponse } from '@/utils/response-success-util';

export class ObjekPajakController {
  static async listObjekPajakPPh21(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ObjekPajakService.listObjekPajakPPh21();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listObjekPajakPPh23(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ObjekPajakService.listObjekPajakPPh23();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listObjekPajakPPh4Ayat2(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ObjekPajakService.listObjekPajakPPh4Ayat2();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listObjekPajakPPN(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ObjekPajakService.listObjekPajakPPN();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
