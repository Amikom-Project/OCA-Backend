import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { WajibPajakBadanUsahaService } from '@/services/wajib-pajak-badan-usaha-service';
import {
  successCreateResponse,
  successDeleteResponse,
  successEditResponse,
  successPagedResponse,
  successSingleResponse,
} from '@/utils/response-success-util';

export class WajibPajakBadanUsahaController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const response = await WajibPajakBadanUsahaService.create(data);

      successCreateResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await WajibPajakBadanUsahaService.list(
        page,
        limit,
        search
      );

      successPagedResponse(
        res,
        response.result,
        response.current_page,
        response.total_page,
        response.total_count
      );
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_wajib_pajak_badan_usaha } = req.params;

      const response = await WajibPajakBadanUsahaService.get(
        kode_wajib_pajak_badan_usaha
      );

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_wajib_pajak_badan_usaha } = req.params;
      const data = req.body;

      const response = await WajibPajakBadanUsahaService.update(
        kode_wajib_pajak_badan_usaha,
        data
      );

      successEditResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_wajib_pajak_badan_usaha } = req.params;

      const response = await WajibPajakBadanUsahaService.delete(
        kode_wajib_pajak_badan_usaha
      );

      successDeleteResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
