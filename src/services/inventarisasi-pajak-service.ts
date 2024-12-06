import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { query } from '@/configs/database-config';
import { InventarisasiPajakValidation } from '@/validations/inventarisasi-pajak-validation';
import { BadRequestError, NotFoundError } from '@/errors/response-error';
import {
  TInventarisasiPajakCreateFormSchema,
  TInventarisasiPajakModelPagedResult,
  TInventarisasiPajakSingleModel,
  TInventarisasiPajakUpdateFormSchema,
  toInventarisasiPajakSingleResponse,
  toPagedInventarisasiPajakResponse,
} from '@/types/inventarisasi-pajak-type';
import { AttachmentService } from '@/services/attachment-service';
import { formatInTimeZone } from 'date-fns-tz';

export class InventarisasiPajakService {
  static async create(
    data: TInventarisasiPajakCreateFormSchema
  ): Promise<TInventarisasiPajakSingleModel> {
    try {
      const request = InventarisasiPajakValidation.parse(data);

      const kode_inventarisasi_pajak = uuidv4();
      const tanggal_input = formatInTimeZone(
        new Date(),
        'Asia/Jakarta',
        'dd MMMM yyyy HH:mm:ss'
      );

      const objekPajakResult = await query(
        `SELECT kode_objek_pajak FROM objek_pajak WHERE kode_objek_pajak = $1`,
        [request.kode_objek_pajak]
      );
      const objekPajak = objekPajakResult.rows[0];
      if (!objekPajak)
        throw new NotFoundError('Kode Objek Pajak tidak ditemukan !');

      const satuanKerjaResult = await query(
        `SELECT idl FROM satuan_kerja WHERE idl = $1`,
        [request.idl]
      );

      const satuanKerja = satuanKerjaResult.rows[0];
      if (!satuanKerja) throw new NotFoundError('IDL tidak ditemukan !');

      // const path = 'registrasi_wajib_pajak';
      // const fileName = `file-bukti-${
      //   request.uraian_kegiatan
      // }-${Date.now().toString()}.pdf`;
      // const mime = 'application/pdf';

      // AttachmentService.upload(path, fileName, mime, request.file_bukti);

      let insertFields = [
        'kode_inventarisasi_pajak',
        'uraian_kegiatan',
        'no_pengajuan',
        'nominal_dpp',
        'jenis_pajak',
        'kode_objek_pajak',
        'nominal_pajak',
        'nama_pemotong',
        'npwp_pemotong',
        'file_bukti',
        'idl',
        'tanggal_input',
      ];

      const insertValues = [
        kode_inventarisasi_pajak,
        request.uraian_kegiatan,
        request.no_pengajuan,
        request.nominal_dpp,
        request.jenis_pajak,
        request.kode_objek_pajak,
        request.nominal_pajak,
        request.nama_pemotong,
        request.npwp_pemotong,
        // fileName,
        request.file_bukti,
        request.idl,
        tanggal_input,
      ];

      const placeholders = insertValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertQuery = `
        INSERT INTO inventarisasi_pajak
        (${insertFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const { rows } = await query(insertQuery, insertValues);

      return toInventarisasiPajakSingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }

      throw error;
    }
  }

  static async list(
    page: number,
    limit: number,
    idl: string,
    search?: string
  ): Promise<TInventarisasiPajakModelPagedResult> {
    try {
      const searchQuery = search
        ? `AND (LOWER(uraian_kegiatan) LIKE $2 OR LOWER(no_pengajuan) LIKE $2)`
        : '';

      const totalCountQuery = `
                              SELECT COUNT(kode_inventarisasi_pajak) as count
                              FROM inventarisasi_pajak
                              WHERE ($1::text IS NULL OR idl = $1)
                              ${searchQuery}
                            `;

      const totalCountParams = search
        ? [idl, `%${search.toLowerCase()}%`]
        : [idl];

      const totalCountResult = await query(totalCountQuery, totalCountParams);
      const totalCount = parseInt(totalCountResult.rows[0].count, 10);

      const totalPage = Math.ceil(totalCount / limit);
      const currentPage = page || 1;

      const resultsQuery = `
                            SELECT kode_inventarisasi_pajak, uraian_kegiatan, no_pengajuan, nominal_dpp, jenis_pajak, kode_objek_pajak, nominal_pajak, nama_pemotong, npwp_pemotong, file_bukti, idl, tanggal_input
                            FROM inventarisasi_pajak
                            WHERE ($1::text IS NULL OR idl = $1)
                            ${searchQuery}
                            ORDER BY tanggal_input DESC
                            LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
                            `;

      const skip = (page - 1) * limit;

      const resultsParams = search
        ? [idl, `%${search.toLowerCase()}%`, limit, skip]
        : [idl, limit, skip];

      const { rows } = await query(resultsQuery, resultsParams);

      const pageableData = toPagedInventarisasiPajakResponse({
        result: rows.map(toInventarisasiPajakSingleResponse),
        current_page: currentPage,
        total_page: totalPage,
        total_count: totalCount,
      });

      return pageableData;
    } catch (error) {
      throw error;
    }
  }

  static async get(
    kode_inventarisasi_pajak: string
  ): Promise<TInventarisasiPajakSingleModel> {
    try {
      const queryText = `
        SELECT kode_inventarisasi_pajak, uraian_kegiatan, no_pengajuan, nominal_dpp, jenis_pajak, kode_objek_pajak, nominal_pajak, nama_pemotong, npwp_pemotong, file_bukti, idl, tanggal_input
        FROM inventarisasi_pajak
        WHERE kode_inventarisasi_pajak = $1
      `;

      const { rows } = await query(queryText, [kode_inventarisasi_pajak]);

      return toInventarisasiPajakSingleResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async update(
    kode_inventarisasi_pajak: string,
    data: TInventarisasiPajakUpdateFormSchema
  ): Promise<TInventarisasiPajakSingleModel> {
    try {
      const request = InventarisasiPajakValidation.parse(data);

      const inventarisasiPajakResult = await query(
        `SELECT kode_inventarisasi_pajak FROM inventarisasi_pajak WHERE kode_inventarisasi_pajak = $1`,
        [kode_inventarisasi_pajak]
      );
      const inventarisasiPajak = inventarisasiPajakResult.rows[0];
      if (!inventarisasiPajak)
        throw new NotFoundError('Inventarisasi Pajak tidak ditemukan !');

      const pengajuanAnggaranResult = await query(
        `SELECT no_pengajuan FROM pengajuan_anggaran WHERE no_pengajuan = $1`,
        [request.no_pengajuan]
      );
      const pengajuanAnggaran = pengajuanAnggaranResult.rows[0];
      if (!pengajuanAnggaran)
        throw new NotFoundError('No Pengajuan Anggaran tidak ditemukan !');

      const objekPajakResult = await query(
        `SELECT kode_objek_pajak FROM objek_pajak WHERE kode_objek_pajak = $1`,
        [request.kode_objek_pajak]
      );
      const objekPajak = objekPajakResult.rows[0];
      if (!objekPajak)
        throw new NotFoundError('Kode Objek Pajak tidak ditemukan !');

      const satuanKerjaResult = await query(
        `SELECT idl FROM satuan_kerja WHERE idl = $1`,
        [request.idl]
      );
      const satuanKerja = satuanKerjaResult.rows[0];
      if (!satuanKerja) throw new NotFoundError('IDL tidak ditemukan !');

      const fieldsToUpdate = [
        'uraian_kegiatan',
        'no_pengajuan',
        'nominal_dpp',
        'jenis_pajak',
        'kode_objek_pajak',
        'nominal_pajak',
        'nama_pemotong',
        'npwp_pemotong',
        'file_bukti',
        'idl',
      ];

      let updateValues = [
        request.uraian_kegiatan,
        request.no_pengajuan,
        request.nominal_dpp,
        request.jenis_pajak,
        request.kode_objek_pajak,
        request.nominal_pajak,
        request.nama_pemotong,
        request.npwp_pemotong,
        request.file_bukti,
        request.idl,
      ];

      const updateSet = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE inventarisasi_pajak
        SET ${updateSet}
        WHERE kode_inventarisasi_pajak = $1
        RETURNING *;
      `;

      const { rows } = await query(updateQuery, [
        kode_inventarisasi_pajak,
        ...updateValues,
      ]);

      return toInventarisasiPajakSingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  static async delete(kode_inventarisasi_pajak: string) {
    try {
      const resultsQuery = `DELETE FROM inventarisasi_pajak
                            WHERE kode_inventarisasi_pajak = $1
                            RETURNING *`;

      const { rows } = await query(resultsQuery, [kode_inventarisasi_pajak]);

      return rows.map(
        toInventarisasiPajakSingleResponse
      ) as TInventarisasiPajakSingleModel[];
    } catch (error) {
      throw error;
    }
  }
}
