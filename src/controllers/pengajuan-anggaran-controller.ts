import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { PengajuanAnggaranService } from '@/services/pengajuan-anggaran-service';
import { successPagedResponse } from '@/utils/response-success-util';

export class PengajuanAnggaranController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PengajuanAnggaranService.list(page, limit, idl);

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
}
