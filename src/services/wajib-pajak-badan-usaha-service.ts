import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { formatInTimeZone } from 'date-fns-tz';

import { query } from '@/configs/database-config';
import { WajibPajakBadanUsahaValidation } from '@/validations/wajib-pajak-badan-usaha-validation';
import { BadRequestError, NotFoundError } from '@/errors/response-error';
import {
  TWajibPajakBadanUsahaModelPagedResult,
  toPagedWajibPajakBadanUsahaResponse,
  TWajibPajakBadanUsahaCreateFormSchema,
  TWajibPajakBadanUsahaSingleModel,
  toWajibPajakBadanUsahaSingleResponse,
  TWajibPajakBadanUsahaUpdateFormSchema,
} from '@/types/wajib-pajak-badan-usaha-type';
// import { AttachmentService } from '@/services/attachment-service';

export class WajibPajakBadanUsahaService {
  static async create(
    data: TWajibPajakBadanUsahaCreateFormSchema
  ): Promise<TWajibPajakBadanUsahaSingleModel> {
    try {
      const request = WajibPajakBadanUsahaValidation.parse(data);

      const kode_wajib_pajak_badan_usaha = uuidv4();
      const tanggal_input = formatInTimeZone(
        new Date(),
        'Asia/Jakarta',
        'dd MMMM yyyy HH:mm:ss'
      );

      const bankResult = await query(
        `SELECT nama_bank FROM bank WHERE nama_bank = $1`,
        [request.nama_bank]
      );
      const namaBank = bankResult.rows[0];
      if (!namaBank) throw new NotFoundError('Nama Bank tidak ditemukan !');

      const provinsiResult = await query(
        `SELECT nama_provinsi FROM provinsi WHERE nama_provinsi = $1`,
        [request.provinsi_npwp]
      );
      const namaProvinsi = provinsiResult.rows[0];
      if (!namaProvinsi)
        throw new NotFoundError('Nama Provinsi tidak ditemukan !');

      const kabupatenResult = await query(
        `SELECT nama_kabupaten FROM kabupaten WHERE nama_kabupaten = $1`,
        [request.kabupaten_npwp]
      );
      const namaKabupaten = kabupatenResult.rows[0];
      if (!namaKabupaten)
        throw new NotFoundError('Nama Kabupaten tidak ditemukan !');

      let insertFields = [
        'kode_wajib_pajak_badan_usaha',
        'nama_badan_usaha',
        'email',
        'file_foto_identitas_badan',
        'npwp',
        'nama_npwp',
        'provinsi_npwp',
        'kabupaten_npwp',
        'file_foto_npwp',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'nama_narahubung',
        'kontak_narahubung',
        'ada_skb_pph23',
        'status_pkp',
        'tanggal_input',
      ];

      // let fileNameFileFotoIdentitasBadan;
      // if (request.file_foto_identitas_badan) {
      //   fileNameFileFotoIdentitasBadan = `file-foto-identitas-badan-${
      //     request.nama_badan_usaha
      //   }-${Date.now().toString()}.jpeg`;

      //   AttachmentService.upload(
      //     'registrasi_wajib_pajak',
      //     fileNameFileFotoIdentitasBadan,
      //     'image/jpeg',
      //     request.file_foto_identitas_badan
      //   );
      // }

      // let fileNameFileFotoNpwp;
      // if (request.file_foto_npwp) {
      //   fileNameFileFotoNpwp = `file-foto-npwp-${
      //     request.nama_badan_usaha
      //   }-${Date.now().toString()}.jpeg`;

      //   AttachmentService.upload(
      //     'registrasi_wajib_pajak',
      //     fileNameFileFotoNpwp,
      //     'image/jpeg',
      //     request.file_foto_npwp
      //   );
      // }

      let insertValues = [
        kode_wajib_pajak_badan_usaha,
        request.nama_badan_usaha,
        request.email,
        // fileNameFileFotoIdentitasBadan,
        request.file_foto_identitas_badan,
        request.npwp,
        request.nama_npwp,
        request.provinsi_npwp,
        request.kabupaten_npwp,
        // fileNameFileFotoNpwp,
        request.file_foto_npwp,
        request.nama_bank,
        request.no_rekening,
        request.nama_rekening,
        request.nama_narahubung,
        request.kontak_narahubung,
        request.ada_skb_pph23,
        request.status_pkp,
        tanggal_input,
      ];

      if (
        request.nama_bank !== 'TUNAI' &&
        request.file_foto_bukti_rekening != null
      ) {
        // const fileNameFileFotoRekening = `file-foto-rekening-${
        //   request.nama_badan_usaha
        // }-${Date.now().toString()}.jpeg`;

        // AttachmentService.upload(
        //   'registrasi_wajib_pajak',
        //   fileNameFileFotoRekening,
        //   'image/jpeg',
        //   request.file_foto_bukti_rekening
        // );

        insertFields.push('file_foto_bukti_rekening');
        insertValues.push(request.file_foto_bukti_rekening);
      }

      if (request.ada_skb_pph23 === 'Ya') {
        // const fileNameFileFotoSuratBebasPPh23 = `file-foto-surat-bebas-pph23-${
        //   request.nama_badan_usaha
        // }-${Date.now().toString()}.jpeg`;

        // AttachmentService.upload(
        //   'registrasi_wajib_pajak',
        //   fileNameFileFotoSuratBebasPPh23,
        //   'image/jpeg',
        //   request.file_surat_bebas_pph23
        // );

        insertFields = insertFields.concat([
          'masa_berlaku_bebas_pph23',
          'file_surat_bebas_pph23',
        ]);
        insertValues = insertValues.concat([
          formatInTimeZone(
            new Date(request.masa_berlaku_bebas_pph23),
            'Asia/Jakarta',
            'dd MMMM yyyy HH:mm:ss'
          ),
          request.file_surat_bebas_pph23,
        ]);
      }

      const placeholders = insertValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertQuery = `
        INSERT INTO wajib_pajak_badan_usaha
        (${insertFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const { rows } = await query(insertQuery, insertValues);

      return toWajibPajakBadanUsahaSingleResponse(rows[0]);
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
    search?: string
  ): Promise<TWajibPajakBadanUsahaModelPagedResult> {
    const searchQuery = search
      ? `WHERE LOWER(nama_badan_usaha) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(npwp) LIKE $1 OR LOWER(nama_bank) LIKE $1 OR LOWER(ada_skb_pph23) LIKE $1 OR LOWER(status_pkp) LIKE $1`
      : '';

    const totalCountQuery = `
      SELECT COUNT(kode_wajib_pajak_badan_usaha) as count
      FROM wajib_pajak_badan_usaha
      ${searchQuery}
    `;

    const totalCountParams = search ? [`%${search.toLowerCase()}%`] : [];
    const totalCountResult = await query(totalCountQuery, totalCountParams);
    const totalCount = parseInt(totalCountResult.rows[0].count, 10);

    const totalPage = Math.ceil(totalCount / limit);
    const currentPage = page || 1;

    const resultsQuery = `
      SELECT kode_wajib_pajak_badan_usaha, nama_badan_usaha, email, file_foto_identitas_badan, npwp, nama_npwp, provinsi_npwp, kabupaten_npwp, file_foto_npwp, nama_bank, no_rekening, nama_rekening, file_foto_bukti_rekening, nama_narahubung, kontak_narahubung, ada_skb_pph23, masa_berlaku_bebas_pph23, file_surat_bebas_pph23, status_pkp, tanggal_input
        FROM wajib_pajak_badan_usaha
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}
    `;

    const skip = (page - 1) * limit;
    const resultsParams = search
      ? [`%${search.toLowerCase()}%`, limit, skip]
      : [limit, skip];

    const { rows } = await query(resultsQuery, resultsParams);

    const pageableData = toPagedWajibPajakBadanUsahaResponse({
      result: rows.map(toWajibPajakBadanUsahaSingleResponse),
      current_page: currentPage,
      total_page: totalPage,
      total_count: totalCount,
    });

    return pageableData;
  }

  static async get(
    kode_wajib_pajak_badan_usaha: string
  ): Promise<TWajibPajakBadanUsahaSingleModel> {
    try {
      const queryText = `
        SELECT kode_wajib_pajak_badan_usaha, nama_badan_usaha, email, file_foto_identitas_badan, npwp, nama_npwp, provinsi_npwp, kabupaten_npwp, file_foto_npwp, nama_bank, no_rekening, nama_rekening, file_foto_bukti_rekening, nama_narahubung, kontak_narahubung, ada_skb_pph23, masa_berlaku_bebas_pph23, file_surat_bebas_pph23, status_pkp, tanggal_input
        FROM wajib_pajak_badan_usaha
        WHERE kode_wajib_pajak_badan_usaha = $1
      `;

      const { rows } = await query(queryText, [kode_wajib_pajak_badan_usaha]);

      return toWajibPajakBadanUsahaSingleResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async update(
    kode_wajib_pajak_badan_usaha: string,
    data: TWajibPajakBadanUsahaUpdateFormSchema
  ): Promise<TWajibPajakBadanUsahaSingleModel> {
    try {
      const request = WajibPajakBadanUsahaValidation.parse(data);

      const wajibPajakBadanUsahaResult = await query(
        `SELECT kode_wajib_pajak_badan_usaha FROM wajib_pajak_badan_usaha WHERE kode_wajib_pajak_badan_usaha = $1`,
        [kode_wajib_pajak_badan_usaha]
      );
      const wajibPajakBadanUsaha = wajibPajakBadanUsahaResult.rows[0];
      if (!wajibPajakBadanUsaha)
        throw new NotFoundError('Wajib Pajak Badan Usaha tidak ditemukan !');

      const bankResult = await query(
        `SELECT nama_bank FROM bank WHERE nama_bank = $1`,
        [request.nama_bank]
      );
      const namaBank = bankResult.rows[0];
      if (!namaBank) throw new NotFoundError('Nama Bank tidak ditemukan !');

      const provinsiResult = await query(
        `SELECT nama_provinsi FROM provinsi WHERE nama_provinsi = $1`,
        [request.provinsi_npwp]
      );
      const namaProvinsi = provinsiResult.rows[0];
      if (!namaProvinsi)
        throw new NotFoundError('Nama Provinsi tidak ditemukan !');

      const kabupatenResult = await query(
        `SELECT nama_kabupaten FROM kabupaten WHERE nama_kabupaten = $1`,
        [request.kabupaten_npwp]
      );
      const namaKabupaten = kabupatenResult.rows[0];
      if (!namaKabupaten)
        throw new NotFoundError('Nama Kabupaten tidak ditemukan !');

      const fieldsToUpdate = [
        'nama_badan_usaha',
        'email',
        'file_foto_identitas_badan',
        'npwp',
        'nama_npwp',
        'provinsi_npwp',
        'kabupaten_npwp',
        'file_foto_npwp',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'file_foto_bukti_rekening',
        'nama_narahubung',
        'kontak_narahubung',
        'ada_skb_pph23',
        'status_pkp',
      ];

      let updateValues = [
        request.nama_badan_usaha,
        request.email,
        request.file_foto_identitas_badan,
        request.npwp,
        request.nama_npwp,
        request.provinsi_npwp,
        request.kabupaten_npwp,
        request.file_foto_npwp,
        request.nama_bank,
        request.no_rekening,
        request.nama_rekening,
        request.file_foto_bukti_rekening,
        request.nama_narahubung,
        request.kontak_narahubung,
        request.ada_skb_pph23,
        request.status_pkp,
      ];

      if (request.ada_skb_pph23 === 'Ya') {
        fieldsToUpdate.push(
          'masa_berlaku_bebas_pph23',
          'file_surat_bebas_pph23'
        );
        updateValues = updateValues.concat([
          formatInTimeZone(
            new Date(request.masa_berlaku_bebas_pph23),
            'Asia/Jakarta',
            'dd MMMM yyyy HH:mm:ss'
          ),
          request.file_surat_bebas_pph23,
        ]);
      }

      const updateSet = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE wajib_pajak_badan_usaha
        SET ${updateSet}
        WHERE kode_wajib_pajak_badan_usaha = $1
        RETURNING *;
      `;

      const { rows } = await query(updateQuery, [
        kode_wajib_pajak_badan_usaha,
        ...updateValues,
      ]);

      return toWajibPajakBadanUsahaSingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  static async delete(kode_wajib_pajak_badan_usaha: string) {
    const resultsQuery = `DELETE FROM wajib_pajak_badan_usaha
    WHERE kode_wajib_pajak_badan_usaha = $1
    RETURNING *`;

    const { rows } = await query(resultsQuery, [kode_wajib_pajak_badan_usaha]);

    return rows.map(
      toWajibPajakBadanUsahaSingleResponse
    ) as TWajibPajakBadanUsahaSingleModel[];
  }
}
