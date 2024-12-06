import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { KabupatenService } from '@/services/kabupaten-service';
import { successResponse } from '@/utils/response-success-util';

export class KabupatenController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const nama_provinsi = req.query.nama_provinsi as string;

      const response = await KabupatenService.list(nama_provinsi);

      successResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
