import { Request, Response, NextFunction } from 'express';

import { handleError } from '@/errors/response-error';
import { PPh4Ayat2Service } from '@/services/pph-4-ayat-2-service';
import {
  successCreateResponse,
  successDeleteResponse,
  successEditResponse,
  successPagedResponse,
  successSingleResponse,
} from '@/utils/response-success-util';

export class PPh4Ayat2Controller {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const response = await PPh4Ayat2Service.create(data);

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

      const response = await PPh4Ayat2Service.list(page, limit, idl, search);

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

  static async listEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PPh4Ayat2Service.listEntry(
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

  static async listVerifikasi(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PPh4Ayat2Service.listVerifikasi(
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

  static async listSetor(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PPh4Ayat2Service.listSetor(
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
      const { kode_kegiatan_penghasilan_badan_usaha } = req.params;

      const response = await PPh4Ayat2Service.get(
        kode_kegiatan_penghasilan_badan_usaha
      );

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_kegiatan_penghasilan_badan_usaha } = req.params;
      const data = req.body;

      const response = await PPh4Ayat2Service.update(
        kode_kegiatan_penghasilan_badan_usaha,
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
      const { kode_kegiatan_penghasilan_badan_usaha } = req.params;

      const response = await PPh4Ayat2Service.delete(
        kode_kegiatan_penghasilan_badan_usaha
      );

      successDeleteResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
