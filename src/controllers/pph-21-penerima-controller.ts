import { Request, Response, NextFunction } from 'express';

import { PPh21PenerimaService } from '@/services/pph-21-penerima-service';
import {
  successCreateResponse,
  successDeleteResponse,
  successEditResponse,
  successPagedResponse,
  successSingleResponse,
} from '@/utils/response-success-util';
import { handleError } from '@/errors/response-error';

export class PPh21PenerimaController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const { kode_kegiatan_penghasilan_orang_pribadi } = req.params;

      const response = await PPh21PenerimaService.create({
        ...data,
        kode_kegiatan_penghasilan_orang_pribadi,
      });

      successCreateResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const { kode_kegiatan_penghasilan_orang_pribadi } = req.params;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PPh21PenerimaService.list(
        page,
        limit,
        kode_kegiatan_penghasilan_orang_pribadi,
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

  static async listEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const idl = req.query.idl as string;
      const search = req.query.search as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const response = await PPh21PenerimaService.listEntry(
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

      const response = await PPh21PenerimaService.listVerifikasi(
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

      const response = await PPh21PenerimaService.listSetor(
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
      const { kode_item_kegiatan_penghasilan_orang_pribadi } = req.params;

      const response = await PPh21PenerimaService.get(
        kode_item_kegiatan_penghasilan_orang_pribadi
      );

      successSingleResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { kode_item_kegiatan_penghasilan_orang_pribadi } = req.params;
      const data = req.body;

      const response = await PPh21PenerimaService.update(
        kode_item_kegiatan_penghasilan_orang_pribadi,
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
      const { kode_item_kegiatan_penghasilan_orang_pribadi } = req.params;

      const response = await PPh21PenerimaService.delete(
        kode_item_kegiatan_penghasilan_orang_pribadi
      );

      successDeleteResponse(res, response);
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
    }
  }
}
