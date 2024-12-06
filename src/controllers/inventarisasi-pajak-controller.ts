import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { InventarisasiPajakService } from '@/services/inventarisasi-pajak-service';
import {
  successCreateResponse,
  successDeleteResponse,
  successEditResponse,
  successPagedResponse,
  successSingleResponse,
} from '@/utils/response-success-util';

export class InventarisasiPajakController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const response = await InventarisasiPajakService.create(data);

      successCreateResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
      console.log('error :', err.message);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await InventarisasiPajakService.list(
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
      const { kode_inventarisasi_pajak } = req.params;

      const response = await InventarisasiPajakService.get(
        kode_inventarisasi_pajak
      );

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_inventarisasi_pajak } = req.params;
      const data = req.body;

      const response = await InventarisasiPajakService.update(
        kode_inventarisasi_pajak,
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
      const { kode_inventarisasi_pajak } = req.params;

      const response = await InventarisasiPajakService.delete(
        kode_inventarisasi_pajak
      );

      successDeleteResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
