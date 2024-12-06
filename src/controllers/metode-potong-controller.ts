import { Request, Response, NextFunction } from 'express';

import { MetodePotongService } from '@/services/metode-potong-service';
import { successResponse } from '@/utils/response-success-util';
import { handleError } from '@/errors/response-error';

export class MetodePotongController {
  static async listMetodePotongPegawaiTetap(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await MetodePotongService.listMetodePotongPegawaiTetap();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listMetodePotongPegawaiTidakTetap(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await MetodePotongService.listMetodePotongPegawaiTidakTetap();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listMetodePotongBukanPegawai(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await MetodePotongService.listMetodePotongBukanPegawai();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listMetodePotongDewanKomisaris(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await MetodePotongService.listMetodePotongDewanKomisaris();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listMetodePotongMantanPegawai(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await MetodePotongService.listMetodePotongMantanPegawai();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async listMetodePotongWargaNegaraAsing(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response =
        await MetodePotongService.listMetodePotongWargaNegaraAsing();

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
