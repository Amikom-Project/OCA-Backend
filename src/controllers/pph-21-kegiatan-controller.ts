import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { PPh21KegiatanService } from '@/services/pph-21-kegiatan-service';
import {
  successCreateResponse,
  successDeleteResponse,
  successEditResponse,
  successPagedResponse,
  successSingleResponse,
} from '@/utils/response-success-util';

export class PPh21KegiatanController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const response = await PPh21KegiatanService.create(data);

      successCreateResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PPh21KegiatanService.list(
        page,
        limit,
        idl,
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
      const { kode_kegiatan_penghasilan_orang_pribadi } = req.params;

      const response = await PPh21KegiatanService.get(
        kode_kegiatan_penghasilan_orang_pribadi
      );

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_kegiatan_penghasilan_orang_pribadi } = req.params;
      const data = req.body;

      const response = await PPh21KegiatanService.update(
        kode_kegiatan_penghasilan_orang_pribadi,
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
      const { kode_kegiatan_penghasilan_orang_pribadi } = req.params;

      const response = await PPh21KegiatanService.delete(
        kode_kegiatan_penghasilan_orang_pribadi
      );

      successDeleteResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
