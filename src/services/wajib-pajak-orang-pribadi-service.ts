import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { formatInTimeZone } from 'date-fns-tz';

import { query } from '@/configs/database-config';
import { WajibPajakOrangPribadiValidation } from '@/validations/wajib-pajak-orang-pribadi-validation';
import { BadRequestError, NotFoundError } from '@/errors/response-error';
import {
  TWajibPajakOrangPribadiModelPagedResult,
  toPagedWajibPajakOrangPribadiResponse,
  TWajibPajakOrangPribadiCreateFormSchema,
  toWajibPajakOrangPribadiSingleResponse,
  TWajibPajakOrangPribadiSingleModel,
  TWajibPajakOrangPribadiUpdateFormSchema,
  toWajibPajakOrangPribadiOptionResponse,
  TWajibPajakOrangPribadiOptionModel,
} from '@/types/wajib-pajak-orang-pribadi-type';
// import { AttachmentService } from '@/services/attachment-service';

export class WajibPajakOrangPribadiService {
  static async create(
    data: TWajibPajakOrangPribadiCreateFormSchema
  ): Promise<TWajibPajakOrangPribadiSingleModel> {
    try {
      const request = WajibPajakOrangPribadiValidation.parse(data);

      const kode_wajib_pajak_orang_pribadi = uuidv4();
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

      if (request.ada_npwp === 'Ya') {
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
      }

      let insertFields = [
        'kode_wajib_pajak_orang_pribadi',
        'nama',
        'email',
        'status_pegawai',
        'nip',
        'kewarganegaraan',
        'nama_negara',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'ada_npwp',
        'ptkp',
        'disetujui',
        'tanggal_input',
      ];

      let insertValues = [
        kode_wajib_pajak_orang_pribadi,
        request.nama,
        request.email,
        request.status_pegawai,
        request.nip || null,
        request.kewarganegaraan,
        request.kewarganegaraan === 'WNI' ? 'Indonesia' : request.nama_negara,
        request.nama_bank,
        request.no_rekening,
        request.nama_rekening,
        request.ada_npwp,
        request.ptkp,
        'Ya',
        tanggal_input,
      ];

      if (
        request.status_pegawai === 'Pegawai Tetap' ||
        request.status_pegawai === 'Dewan Komisaris' ||
        request.status_pegawai === 'Mantan Pegawai'
      ) {
        if (!insertFields.includes('nip')) {
          insertFields.push('nip');
          insertValues.push(request.nip);
        }
      }

      if (
        request.nama_bank !== 'TUNAI' &&
        request.file_foto_bukti_rekening != null
      ) {
        // const fileNameFileFotoRekening = `file-foto-rekening-${
        //   request.nama
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

      if (request.kewarganegaraan === 'WNI') {
        // let fileNameFileFotoKtp;
        // if (request.file_foto_ktp) {
        //   fileNameFileFotoKtp = `file-foto-ktp-${
        //     request.nama
        //   }-${Date.now().toString()}.jpeg`;

        //   AttachmentService.upload(
        //     'registrasi_wajib_pajak',
        //     fileNameFileFotoKtp,
        //     'image/jpeg',
        //     request.file_foto_ktp
        //   );
        // }

        insertFields = insertFields.concat([
          'nik',
          'nama_ktp',
          'file_foto_ktp',
        ]);
        insertValues = insertValues.concat([
          request.nik,
          request.nama_ktp,
          request.file_foto_ktp,
        ]);

        if (request.ada_npwp === 'Ya') {
          // let fileNameFileFotoNpwp;
          // if (request.file_foto_npwp) {
          //   fileNameFileFotoNpwp = `file-foto-npwp-${
          //     request.nama
          //   }-${Date.now().toString()}.jpeg`;

          //   AttachmentService.upload(
          //     'registrasi_wajib_pajak',
          //     fileNameFileFotoNpwp,
          //     'image/jpeg',
          //     request.file_foto_npwp
          //   );
          // }

          insertFields = insertFields.concat([
            'npwp',
            'nama_npwp',
            'provinsi_npwp',
            'kabupaten_npwp',
            'file_foto_npwp',
          ]);
          insertValues = insertValues.concat([
            request.npwp,
            request.nama_npwp,
            request.provinsi_npwp,
            request.kabupaten_npwp,
            request.file_foto_npwp,
          ]);
        }
      } else if (request.kewarganegaraan === 'WNA') {
        // let fileNameFileFotoPassport;
        // if (request.file_foto_passport) {
        //   fileNameFileFotoPassport = `file-foto-passport-${
        //     request.nama
        //   }-${Date.now().toString()}.jpeg`;

        //   AttachmentService.upload(
        //     'registrasi_wajib_pajak',
        //     fileNameFileFotoPassport,
        //     'image/jpeg',
        //     request.file_foto_passport
        //   );
        // }

        insertFields = insertFields.concat([
          'no_passport',
          'nama_passport',
          'masa_berlaku_passport',
          'file_foto_passport',
        ]);
        insertValues = insertValues.concat([
          request.no_passport,
          request.nama_passport,
          formatInTimeZone(
            new Date(request.masa_berlaku_passport),
            'Asia/Jakarta',
            'dd MMMM yyyy HH:mm:ss'
          ),
          request.file_foto_passport,
        ]);
      }

      const placeholders = insertValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertQuery = `
        INSERT INTO wajib_pajak_orang_pribadi
        (${insertFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const { rows } = await query(insertQuery, insertValues);

      return toWajibPajakOrangPribadiSingleResponse(rows[0]);
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
  ): Promise<TWajibPajakOrangPribadiModelPagedResult> {
    try {
      const searchQuery = search
        ? `WHERE LOWER(nama) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(kewarganegaraan) LIKE $1 OR LOWER(status_pegawai) LIKE $1`
        : '';

      const totalCountQuery = `SELECT COUNT(kode_wajib_pajak_orang_pribadi) as count
                                FROM wajib_pajak_orang_pribadi
                                ${searchQuery}
                              `;

      const totalCountParams = search ? [`%${search.toLowerCase()}%`] : [];
      const totalCountResult = await query(totalCountQuery, totalCountParams);
      const totalCount = parseInt(totalCountResult.rows[0].count, 10);

      const totalPage = Math.ceil(totalCount / limit);
      const currentPage = page || 1;

      const resultsQuery = ` SELECT kode_wajib_pajak_orang_pribadi, nama, email, status_pegawai, nip, kewarganegaraan, nama_negara, nik, nama_ktp, file_foto_ktp, nama_bank, no_rekening, nama_rekening, file_foto_bukti_rekening, ada_npwp, npwp, nama_npwp, provinsi_npwp, kabupaten_npwp, file_foto_npwp, ptkp, no_passport, nama_passport, masa_berlaku_passport, file_foto_passport, disetujui, tanggal_input FROM wajib_pajak_orang_pribadi 
                            ${searchQuery}
                            ORDER BY tanggal_input DESC
                            LIMIT $${search ? 2 : 1} OFFSET $${search ? 3 : 2}
                          `;

      const skip = (page - 1) * limit;
      const resultsParams = search
        ? [`%${search.toLowerCase()}%`, limit, skip]
        : [limit, skip];

      const { rows } = await query(resultsQuery, resultsParams);

      const pageableData = toPagedWajibPajakOrangPribadiResponse({
        result: rows.map(toWajibPajakOrangPribadiSingleResponse),
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
    kode_wajib_pajak_orang_pribadi: string
  ): Promise<TWajibPajakOrangPribadiSingleModel> {
    try {
      const queryText = `
        SELECT kode_wajib_pajak_orang_pribadi, nama, email, status_pegawai, nip, kewarganegaraan, nama_negara, nik, nama_ktp, file_foto_ktp, nama_bank, no_rekening, nama_rekening, file_foto_bukti_rekening, ada_npwp, npwp, nama_npwp, provinsi_npwp, kabupaten_npwp, file_foto_npwp, ptkp, no_passport, nama_passport, masa_berlaku_passport, file_foto_passport, disetujui, tanggal_input FROM wajib_pajak_orang_pribadi
        WHERE kode_wajib_pajak_orang_pribadi = $1
      `;

      const { rows } = await query(queryText, [kode_wajib_pajak_orang_pribadi]);

      return toWajibPajakOrangPribadiSingleResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async update(
    kode_wajib_pajak_orang_pribadi: string,
    data: TWajibPajakOrangPribadiUpdateFormSchema
  ): Promise<TWajibPajakOrangPribadiSingleModel> {
    try {
      const request = WajibPajakOrangPribadiValidation.parse(data);

      const wajibPajakOrangPribadiResult = await query(
        `SELECT kode_wajib_pajak_orang_pribadi FROM wajib_pajak_orang_pribadi WHERE kode_wajib_pajak_orang_pribadi = $1`,
        [kode_wajib_pajak_orang_pribadi]
      );
      const wajibPajakOrangPribadi = wajibPajakOrangPribadiResult.rows[0];
      if (!wajibPajakOrangPribadi)
        throw new NotFoundError('Wajib Pajak Orang Pribadi tidak ditemukan !');

      const bankResult = await query(
        `SELECT nama_bank FROM bank WHERE nama_bank = $1`,
        [request.nama_bank]
      );
      const namaBank = bankResult.rows[0];
      if (!namaBank) throw new NotFoundError('Nama Bank tidak ditemukan !');

      if (request.ada_npwp === 'Ya') {
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
      }

      const fieldsToUpdate = [
        'nama',
        'email',
        'status_pegawai',
        'kewarganegaraan',
        'nama_negara',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'file_foto_bukti_rekening',
        'ada_npwp',
        'npwp',
        'nama_npwp',
        'provinsi_npwp',
        'kabupaten_npwp',
        'file_foto_npwp',
        'ptkp',
      ];

      let updateValues = [
        request.nama,
        request.email,
        request.status_pegawai,
        request.kewarganegaraan,
        request.kewarganegaraan === 'WNI' ? 'Indonesia' : request.nama_negara,
        request.nama_bank,
        request.no_rekening || null,
        request.nama_rekening || null,
        request.file_foto_bukti_rekening || null,
        request.ada_npwp,
        request.npwp || null,
        request.nama_npwp || null,
        request.provinsi_npwp || null,
        request.kabupaten_npwp || null,
        request.file_foto_npwp || null,
        request.ptkp,
      ];

      if (
        request.status_pegawai === 'Pegawai Tetap' ||
        request.status_pegawai === 'Dewan Komisaris' ||
        request.status_pegawai === 'Mantan Pegawai'
      ) {
        fieldsToUpdate.push('nip');
        updateValues.push(request.nip || null);
      } else {
        fieldsToUpdate.push('nip');
        updateValues.push(null);
      }

      if (request.kewarganegaraan === 'WNI') {
        fieldsToUpdate.push('nik', 'nama_ktp', 'file_foto_ktp');
        updateValues = updateValues.concat([
          request.nik,
          request.nama_ktp,
          request.file_foto_ktp,
        ]);
      } else if (request.kewarganegaraan === 'WNA') {
        fieldsToUpdate.push(
          'no_passport',
          'nama_passport',
          'masa_berlaku_passport',
          'file_foto_passport'
        );
        updateValues = updateValues.concat([
          request.no_passport,
          request.nama_passport,
          formatInTimeZone(
            new Date(request.masa_berlaku_passport),
            'Asia/Jakarta',
            'dd MMMM yyyy HH:mm:ss'
          ),
          request.file_foto_passport,
        ]);
      }

      const updateSet = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE wajib_pajak_orang_pribadi
        SET ${updateSet}
        WHERE kode_wajib_pajak_orang_pribadi = $1
        RETURNING *;
      `;

      const { rows } = await query(updateQuery, [
        kode_wajib_pajak_orang_pribadi,
        ...updateValues,
      ]);

      return toWajibPajakOrangPribadiSingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  static async delete(kode_wajib_pajak_orang_pribadi: string) {
    try {
      const resultsQuery = `DELETE FROM wajib_pajak_orang_pribadi
                            WHERE kode_wajib_pajak_orang_pribadi = $1
                            RETURNING *`;

      const { rows } = await query(resultsQuery, [
        kode_wajib_pajak_orang_pribadi,
      ]);

      return rows.map(
        toWajibPajakOrangPribadiSingleResponse
      ) as TWajibPajakOrangPribadiSingleModel[];
    } catch (error) {
      throw error;
    }
  }

  static async option(
    nama: string
  ): Promise<TWajibPajakOrangPribadiOptionModel> {
    try {
      const queryText = `
        SELECT status_pegawai, kewarganegaraan, nik, nama_bank, no_rekening, nama_rekening, npwp, no_passport FROM wajib_pajak_orang_pribadi
        WHERE nama = $1
      `;

      const { rows } = await query(queryText, [nama]);

      return toWajibPajakOrangPribadiOptionResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }
}
