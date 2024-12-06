import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { WajibPajakOrangPribadiService } from '@/services/wajib-pajak-orang-pribadi-service';
import {
  successCreateResponse,
  successDeleteResponse,
  successEditResponse,
  successPagedResponse,
  successSingleResponse,
} from '@/utils/response-success-util';

export class WajibPajakOrangPribadiController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const response = await WajibPajakOrangPribadiService.create(data);

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

      const response = await WajibPajakOrangPribadiService.list(
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
      const { kode_wajib_pajak_orang_pribadi } = req.params;

      const response = await WajibPajakOrangPribadiService.get(
        kode_wajib_pajak_orang_pribadi
      );

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_wajib_pajak_orang_pribadi } = req.params;
      const data = req.body;

      const response = await WajibPajakOrangPribadiService.update(
        kode_wajib_pajak_orang_pribadi,
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
      const { kode_wajib_pajak_orang_pribadi } = req.params;

      const response = await WajibPajakOrangPribadiService.delete(
        kode_wajib_pajak_orang_pribadi
      );

      successDeleteResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async option(req: Request, res: Response, next: NextFunction) {
    try {
      const { nama } = req.params;

      const response = await WajibPajakOrangPribadiService.option(nama);

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
