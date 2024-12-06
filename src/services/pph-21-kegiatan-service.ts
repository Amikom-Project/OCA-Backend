import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { formatInTimeZone } from 'date-fns-tz';

import { query } from '@/configs/database-config';
import { PPh21KegiatanValidation } from '@/validations/pph-21-kegiatan-validation';
import { BadRequestError, NotFoundError } from '@/errors/response-error';
import {
  TPPh21KegiatanCreateFormSchema,
  TPPh21KegiatanModel,
  TPPh21KegiatanModelPagedResult,
  TPPh21KegiatanSingleModel,
  TPPh21KegiatanUpdateFormSchema,
  toPPh21KegiatanResponse,
  toPPh21KegiatanSingleResponse,
  toPagedPPh21KegiatanResponse,
} from '@/types/pph-21-kegiatan-type';

export class PPh21KegiatanService {
  static async create(
    data: TPPh21KegiatanCreateFormSchema
  ): Promise<TPPh21KegiatanSingleModel> {
    try {
      const request = PPh21KegiatanValidation.parse(data);

      const kode_kegiatan_penghasilan_orang_pribadi = uuidv4();
      const tanggal_input = formatInTimeZone(
        new Date(),
        'Asia/Jakarta',
        'dd MMMM yyyy HH:mm:ss'
      );

      const jenisPenghasilanResult = await query(
        `SELECT jenis_penghasilan FROM jenis_penghasilan WHERE jenis_penghasilan = $1`,
        [request.jenis_penghasilan]
      );
      const jenisPenghasilan = jenisPenghasilanResult.rows[0];
      if (!jenisPenghasilan)
        throw new NotFoundError('Jenis Penghasilan tidak ditemukan !');

      const pengajuanAnggaranResult = await query(
        `SELECT no_pengajuan FROM pengajuan_anggaran WHERE no_pengajuan = $1`,
        [request.no_pengajuan]
      );
      const pengajuanAnggaran = pengajuanAnggaranResult.rows[0];
      if (!pengajuanAnggaran)
        throw new NotFoundError('No Pengajuan Anggaran tidak ditemukan !');

      const satuanKerjaResult = await query(
        `SELECT idl FROM satuan_kerja WHERE idl = $1`,
        [request.idl]
      );
      const satuanKerja = satuanKerjaResult.rows[0];
      if (!satuanKerja) throw new NotFoundError('IDL tidak ditemukan !');

      let insertFields = [
        'kode_kegiatan_penghasilan_orang_pribadi',
        'kode_jenis_pajak',
        'jenis_penghasilan',
        'uraian_kegiatan',
        'no_pengajuan',
        'pic_pencairan_penghasilan',
        'minta_billing_sendiri',
        'idl',
        'tanggal_input',
      ];

      const insertValues = [
        kode_kegiatan_penghasilan_orang_pribadi,
        1,
        request.jenis_penghasilan,
        request.uraian_kegiatan,
        request.no_pengajuan,
        request.pic_pencairan_penghasilan,
        request.minta_billing_sendiri,
        request.idl,
        tanggal_input,
      ];

      const placeholders = insertValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertQuery = `
        INSERT INTO kegiatan_penghasilan_orang_pribadi
        (${insertFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const { rows } = await query(insertQuery, insertValues);

      return toPPh21KegiatanSingleResponse(rows[0]);
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
  ): Promise<TPPh21KegiatanModelPagedResult> {
    try {
      const searchQuery = search
        ? `AND (LOWER(uraian_kegiatan) LIKE $2 OR LOWER(no_pengajuan) LIKE $2 OR LOWER(jenis_penghasilan) LIKE $2)`
        : '';

      const totalCountQuery = `
        SELECT COUNT(kode_kegiatan_penghasilan_orang_pribadi) as count
        FROM kegiatan_penghasilan_orang_pribadi
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
        SELECT kp.kode_kegiatan_penghasilan_orang_pribadi,
               kp.tanggal_input,
               kp.uraian_kegiatan,
               kp.no_pengajuan,
               kp.jenis_penghasilan,
               COALESCE(SUM(ik.penghasilan_bruto), 0) AS total_penghasilan_bruto,
               COALESCE(SUM(ik.potongan_pajak), 0) AS total_potongan_pajak
        FROM kegiatan_penghasilan_orang_pribadi kp
        LEFT JOIN item_kegiatan_penghasilan_orang_pribadi ik
          ON kp.kode_kegiatan_penghasilan_orang_pribadi = ik.kode_kegiatan_penghasilan_orang_pribadi
        WHERE ($1::text IS NULL OR kp.idl = $1)
        ${searchQuery}
        GROUP BY kp.kode_kegiatan_penghasilan_orang_pribadi, kp.tanggal_input, kp.uraian_kegiatan, kp.no_pengajuan, kp.jenis_penghasilan
        ORDER BY kp.tanggal_input DESC
        LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
      `;

      const skip = (page - 1) * limit;

      const resultsParams = search
        ? [idl, `%${search.toLowerCase()}%`, limit, skip]
        : [idl, limit, skip];

      const { rows } = await query(resultsQuery, resultsParams);

      const pageableData = toPagedPPh21KegiatanResponse({
        result: rows.map(toPPh21KegiatanResponse),
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
    kode_kegiatan_penghasilan_orang_pribadi: string
  ): Promise<TPPh21KegiatanSingleModel> {
    try {
      const queryText = `
        SELECT kode_kegiatan_penghasilan_orang_pribadi, kode_jenis_pajak, jenis_penghasilan, uraian_kegiatan, no_pengajuan, pic_pencairan_penghasilan, minta_billing_sendiri, idl, tanggal_input
        FROM kegiatan_penghasilan_orang_pribadi
        WHERE kode_kegiatan_penghasilan_orang_pribadi = $1
      `;

      const { rows } = await query(queryText, [
        kode_kegiatan_penghasilan_orang_pribadi,
      ]);

      return toPPh21KegiatanSingleResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async update(
    kode_kegiatan_penghasilan_orang_pribadi: string,
    data: TPPh21KegiatanUpdateFormSchema
  ): Promise<TPPh21KegiatanSingleModel> {
    try {
      const request = PPh21KegiatanValidation.parse(data);

      const pph21KegiatanResult = await query(
        `SELECT kode_kegiatan_penghasilan_orang_pribadi FROM kegiatan_penghasilan_orang_pribadi WHERE kode_kegiatan_penghasilan_orang_pribadi = $1`,
        [kode_kegiatan_penghasilan_orang_pribadi]
      );
      const pph21Kegiatan = pph21KegiatanResult.rows[0];
      if (!pph21Kegiatan)
        throw new NotFoundError('PPh 21 Kegiatan tidak ditemukan !');

      const jenisPenghasilanResult = await query(
        `SELECT jenis_penghasilan FROM jenis_penghasilan WHERE jenis_penghasilan = $1`,
        [request.jenis_penghasilan]
      );
      const jenisPenghasilan = jenisPenghasilanResult.rows[0];
      if (!jenisPenghasilan)
        throw new NotFoundError('Jenis Penghasilan tidak ditemukan !');

      const pengajuanAnggaranResult = await query(
        `SELECT no_pengajuan FROM pengajuan_anggaran WHERE no_pengajuan = $1`,
        [request.no_pengajuan]
      );
      const pengajuanAnggaran = pengajuanAnggaranResult.rows[0];
      if (!pengajuanAnggaran)
        throw new NotFoundError('No Pengajuan Anggaran tidak ditemukan !');

      const satuanKerjaResult = await query(
        `SELECT idl FROM satuan_kerja WHERE idl = $1`,
        [request.idl]
      );
      const satuanKerja = satuanKerjaResult.rows[0];
      if (!satuanKerja) throw new NotFoundError('IDL tidak ditemukan !');

      const fieldsToUpdate = [
        'kode_jenis_pajak',
        'jenis_penghasilan',
        'uraian_kegiatan',
        'no_pengajuan',
        'pic_pencairan_penghasilan',
        'minta_billing_sendiri',
        'idl',
      ];

      let updateValues = [
        1,
        request.jenis_penghasilan,
        request.uraian_kegiatan,
        request.no_pengajuan,
        request.pic_pencairan_penghasilan,
        request.minta_billing_sendiri,
        request.idl,
      ];

      const updateSet = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE kegiatan_penghasilan_orang_pribadi
        SET ${updateSet}
        WHERE kode_kegiatan_penghasilan_orang_pribadi = $1
        RETURNING *;
      `;

      const { rows } = await query(updateQuery, [
        kode_kegiatan_penghasilan_orang_pribadi,
        ...updateValues,
      ]);

      return toPPh21KegiatanSingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  static async delete(kode_kegiatan_penghasilan_orang_pribadi: string) {
    try {
      const resultsQuery = `DELETE FROM kegiatan_penghasilan_orang_pribadi
                            WHERE kode_kegiatan_penghasilan_orang_pribadi = $1
                            RETURNING *`;

      const { rows } = await query(resultsQuery, [
        kode_kegiatan_penghasilan_orang_pribadi,
      ]);

      return rows.map(
        toPPh21KegiatanSingleResponse
      ) as TPPh21KegiatanSingleModel[];
    } catch (error) {
      throw error;
    }
  }
}
