import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { format, isAfter } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { id } from 'date-fns/locale';

import { query } from '@/configs/database-config';
import { PPh23Validation } from '@/validations/pph-23-validation';
import { BadRequestError, NotFoundError } from '@/errors/response-error';
import {
  TPPh23CreateFormSchema,
  TPPh23ModelPagedResult,
  TPPh23SingleModel,
  TPPh23UpdateFormSchema,
  toPPh23SingleResponse,
  toPagedPPh23Response,
} from '@/types/pph-23-type';
// import { AttachmentService } from '@/services/attachment-service';

export class PPh23Service {
  static async create(
    data: TPPh23CreateFormSchema
  ): Promise<TPPh23SingleModel> {
    try {
      const request = PPh23Validation.parse(data);

      const kode_kegiatan_penghasilan_badan_usaha = uuidv4();
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

      let wajibPajakOrangPribadi;
      let wajibPajakBadanUsaha;
      if (request.target_penerima === 'Wajib Pajak Orang Pribadi') {
        const wajibPajakOrangPribadiResult = await query(
          `SELECT nama, nama_bank, no_rekening, nama_rekening, npwp FROM wajib_pajak_orang_pribadi WHERE nama = $1`,
          [request.nama_penerima]
        );
        wajibPajakOrangPribadi = wajibPajakOrangPribadiResult.rows[0];
        if (!wajibPajakOrangPribadi)
          throw new NotFoundError(
            'Wajib Pajak Orang Pribadi tidak ditemukan !'
          );
      } else {
        const wajibPajakBadanUsahaResult = await query(
          `SELECT nama_badan_usaha, nama_bank, no_rekening, nama_rekening, npwp, masa_berlaku_bebas_pph23, nama_narahubung FROM wajib_pajak_badan_usaha WHERE nama_badan_usaha = $1`,
          [request.nama_penerima]
        );
        wajibPajakBadanUsaha = wajibPajakBadanUsahaResult.rows[0];
        if (!wajibPajakBadanUsaha)
          throw new NotFoundError('Wajib Pajak Badan Usaha tidak ditemukan !');
      }

      const objekPajakResult = await query(
        `SELECT kode_objek_pajak, tarif_npwp,  tarif_non_npwp FROM objek_pajak WHERE kode_objek_pajak = $1`,
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

      const namaBank =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.nama_bank
          : wajibPajakOrangPribadi.nama_bank;
      const noRekening =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.no_rekening
          : wajibPajakOrangPribadi.no_rekening || null;
      const namaRekening =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.nama_rekening
          : wajibPajakOrangPribadi.nama_rekening || null;
      const npwp =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.npwp
          : wajibPajakOrangPribadi.npwp || null;
      const namaNarahubung =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.nama_narahubung
          : null;
      const masaBerlakuBebasPPh23 =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.masa_berlaku_bebas_pph23
          : null;

      const tarifNpwp = objekPajak.tarif_npwp;
      const tarifNonNpwp = objekPajak.tarif_non_npwp;

      let tarifPajak = 0;
      let potonganPajak = 0;

      const today = format(new Date().toISOString(), 'dd MMMM yyyy HH:mm:ss', {
        locale: id,
      });

      if (
        masaBerlakuBebasPPh23 &&
        isAfter(new Date(masaBerlakuBebasPPh23), today)
      ) {
        tarifPajak = 0;
        potonganPajak = 0;
      } else {
        tarifPajak = npwp !== null ? tarifNpwp : tarifNonNpwp;
        potonganPajak = (tarifPajak / 100) * request.penghasilan_bruto;
      }

      const penghasilanDiterima = request.penghasilan_bruto - potonganPajak;

      let insertFields = [
        'kode_kegiatan_penghasilan_badan_usaha',
        'jenis_penghasilan',
        'uraian_kegiatan',
        'no_pengajuan',
        'target_penerima',
        'nama_penerima',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'npwp',
        'nama_narahubung',
        'kode_objek_pajak',
        'penghasilan_bruto',
        'tarif_pajak',
        'potongan_pajak',
        'penghasilan_diterima',
        'pic_pencairan_penghasilan',
        'invoice',
        'faktur_pajak',
        'dokumen_kerjasama_kegiatan',
        'idl',
        'kode_jenis_pajak',
        'status',
        'tanggal_input',
      ];

      // let fileNameFileInvoice;
      // if (request.invoice) {
      //   fileNameFileInvoice = `file-invoice-${
      //     request.uraian_kegiatan
      //   }-${Date.now().toString()}.pdf`;

      //   AttachmentService.upload(
      //     'registrasi_wajib_pajak',
      //     fileNameFileInvoice,
      //     'application/pdf',
      //     request.invoice
      //   );
      // }

      const insertValues = [
        kode_kegiatan_penghasilan_badan_usaha,
        request.jenis_penghasilan,
        request.uraian_kegiatan,
        request.no_pengajuan,
        request.target_penerima,
        request.nama_penerima,
        namaBank,
        noRekening || null,
        namaRekening || null,
        npwp || null,
        namaNarahubung || null,
        request.kode_objek_pajak,
        request.penghasilan_bruto,
        tarifPajak,
        potonganPajak,
        penghasilanDiterima,
        request.pic_pencairan_penghasilan,
        request.invoice,
        request.faktur_pajak,
        request.dokumen_kerjasama_kegiatan,
        request.idl,
        2,
        'Entry',
        tanggal_input,
      ];

      // let fileNameFileFakturPajak = null;
      // if (request.faktur_pajak) {
      //   fileNameFileFakturPajak = `file-faktur-pajak-${
      //     request.uraian_kegiatan
      //   }-${Date.now().toString()}.pdf`;

      //   AttachmentService.upload(
      //     'registrasi_wajib_pajak',
      //     fileNameFileFakturPajak,
      //     'application/pdf',
      //     request.faktur_pajak
      //   );

      //   insertFields.push('faktur_pajak');
      //   insertValues.push(fileNameFileFakturPajak);
      // }

      // let fileNameFileDokumenKerjasamaKegiatan = null;
      // if (request.dokumen_kerjasama_kegiatan) {
      //   fileNameFileDokumenKerjasamaKegiatan = `file-dokumen-kerjasama-kegiatan-${
      //     request.uraian_kegiatan
      //   }-${Date.now().toString()}.pdf`;

      //   AttachmentService.upload(
      //     'registrasi_wajib_pajak',
      //     fileNameFileDokumenKerjasamaKegiatan,
      //     'application/pdf',
      //     request.dokumen_kerjasama_kegiatan
      //   );

      //   insertFields.push('dokumen_kerjasama_kegiatan');
      //   insertValues.push(fileNameFileDokumenKerjasamaKegiatan);
      // }

      const placeholders = insertValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertQuery = `
        INSERT INTO kegiatan_penghasilan_badan_usaha
        (${insertFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const { rows } = await query(insertQuery, insertValues);

      return toPPh23SingleResponse(rows[0]);
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
  ): Promise<TPPh23ModelPagedResult> {
    const searchQuery = search
      ? `AND (LOWER(uraian_kegiatan) LIKE $2 OR LOWER(no_pengajuan) LIKE $2 OR LOWER(nama_penerima) LIKE $2)`
      : '';

    const totalCountQuery = `
      SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) as count
      FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2
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
      SELECT kode_kegiatan_penghasilan_badan_usaha, jenis_penghasilan, uraian_kegiatan, no_pengajuan, target_penerima, nama_penerima, nama_bank, no_rekening, nama_rekening, npwp, kode_objek_pajak, penghasilan_bruto, tarif_pajak, potongan_pajak, penghasilan_diterima, pic_pencairan_penghasilan, invoice, faktur_pajak, dokumen_kerjasama_kegiatan, idl,kode_jenis_pajak, tanggal_input
        FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

    const skip = (page - 1) * limit;

    const resultsParams = search
      ? [idl, `%${search.toLowerCase()}%`, limit, skip]
      : [idl, limit, skip];

    const { rows } = await query(resultsQuery, resultsParams);

    const pageableData = toPagedPPh23Response({
      result: rows.map(toPPh23SingleResponse),
      current_page: currentPage,
      total_page: totalPage,
      total_count: totalCount,
    });

    return pageableData;
  }

  static async listEntry(
    page: number,
    limit: number,
    idl: string,
    search?: string
  ): Promise<TPPh23ModelPagedResult> {
    const searchQuery = search
      ? `AND (LOWER(uraian_kegiatan) LIKE $2 OR LOWER(no_pengajuan) LIKE $2 OR LOWER(nama_penerima) LIKE $2)`
      : '';

    const totalCountQuery = `
      SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) as count
      FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2 AND status = 'Entry'

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
      SELECT kode_kegiatan_penghasilan_badan_usaha, jenis_penghasilan, uraian_kegiatan, no_pengajuan, target_penerima, nama_penerima, nama_bank, no_rekening, nama_rekening, npwp, kode_objek_pajak, penghasilan_bruto, tarif_pajak, potongan_pajak, penghasilan_diterima, pic_pencairan_penghasilan, invoice, faktur_pajak, dokumen_kerjasama_kegiatan, idl,kode_jenis_pajak, tanggal_input
        FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2 AND status = 'Entry'
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

    const skip = (page - 1) * limit;

    const resultsParams = search
      ? [idl, `%${search.toLowerCase()}%`, limit, skip]
      : [idl, limit, skip];

    const { rows } = await query(resultsQuery, resultsParams);

    const pageableData = toPagedPPh23Response({
      result: rows.map(toPPh23SingleResponse),
      current_page: currentPage,
      total_page: totalPage,
      total_count: totalCount,
    });

    return pageableData;
  }

  static async listVerifikasi(
    page: number,
    limit: number,
    idl: string,
    search?: string
  ): Promise<TPPh23ModelPagedResult> {
    const searchQuery = search
      ? `AND (LOWER(uraian_kegiatan) LIKE $2 OR LOWER(no_pengajuan) LIKE $2 OR LOWER(nama_penerima) LIKE $2)`
      : '';

    const totalCountQuery = `
      SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) as count
      FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2 AND status = 'Verifikasi'

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
      SELECT kode_kegiatan_penghasilan_badan_usaha, jenis_penghasilan, uraian_kegiatan, no_pengajuan, target_penerima, nama_penerima, nama_bank, no_rekening, nama_rekening, npwp, kode_objek_pajak, penghasilan_bruto, tarif_pajak, potongan_pajak, penghasilan_diterima, pic_pencairan_penghasilan, invoice, faktur_pajak, dokumen_kerjasama_kegiatan, idl,kode_jenis_pajak, tanggal_input
        FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2 AND status = 'Verifikasi'
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

    const skip = (page - 1) * limit;

    const resultsParams = search
      ? [idl, `%${search.toLowerCase()}%`, limit, skip]
      : [idl, limit, skip];

    const { rows } = await query(resultsQuery, resultsParams);

    const pageableData = toPagedPPh23Response({
      result: rows.map(toPPh23SingleResponse),
      current_page: currentPage,
      total_page: totalPage,
      total_count: totalCount,
    });

    return pageableData;
  }

  static async listSetor(
    page: number,
    limit: number,
    idl: string,
    search?: string
  ): Promise<TPPh23ModelPagedResult> {
    const searchQuery = search
      ? `AND (LOWER(uraian_kegiatan) LIKE $2 OR LOWER(no_pengajuan) LIKE $2 OR LOWER(nama_penerima) LIKE $2)`
      : '';

    const totalCountQuery = `
      SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) as count
      FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2 AND status = 'Setor'

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
      SELECT kode_kegiatan_penghasilan_badan_usaha, jenis_penghasilan, uraian_kegiatan, no_pengajuan, target_penerima, nama_penerima, nama_bank, no_rekening, nama_rekening, npwp, kode_objek_pajak, penghasilan_bruto, tarif_pajak, potongan_pajak, penghasilan_diterima, pic_pencairan_penghasilan, invoice, faktur_pajak, dokumen_kerjasama_kegiatan, idl,kode_jenis_pajak, tanggal_input
        FROM kegiatan_penghasilan_badan_usaha
      WHERE ($1::text IS NULL OR idl = $1) AND kode_jenis_pajak = 2 AND status = 'Setor'

      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

    const skip = (page - 1) * limit;

    const resultsParams = search
      ? [idl, `%${search.toLowerCase()}%`, limit, skip]
      : [idl, limit, skip];

    const { rows } = await query(resultsQuery, resultsParams);

    const pageableData = toPagedPPh23Response({
      result: rows.map(toPPh23SingleResponse),
      current_page: currentPage,
      total_page: totalPage,
      total_count: totalCount,
    });

    return pageableData;
  }

  static async get(
    kode_kegiatan_penghasilan_badan_usaha: string
  ): Promise<TPPh23SingleModel> {
    try {
      const queryText = `
        SELECT kode_kegiatan_penghasilan_badan_usaha, jenis_penghasilan, uraian_kegiatan, no_pengajuan, target_penerima, nama_penerima, nama_bank, no_rekening, nama_rekening, npwp, kode_objek_pajak, penghasilan_bruto, tarif_pajak, potongan_pajak, penghasilan_diterima, pic_pencairan_penghasilan, invoice, faktur_pajak, dokumen_kerjasama_kegiatan, idl,kode_jenis_pajak, tanggal_input
        FROM kegiatan_penghasilan_badan_usaha
        WHERE kode_kegiatan_penghasilan_badan_usaha = $1
      `;

      const { rows } = await query(queryText, [
        kode_kegiatan_penghasilan_badan_usaha,
      ]);

      return toPPh23SingleResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async update(
    kode_kegiatan_penghasilan_badan_usaha: string,
    data: TPPh23UpdateFormSchema
  ): Promise<TPPh23SingleModel> {
    try {
      const request = PPh23Validation.parse(data);

      const pph23Result = await query(
        `SELECT kode_kegiatan_penghasilan_badan_usaha FROM kegiatan_penghasilan_badan_usaha WHERE kode_kegiatan_penghasilan_badan_usaha = $1`,
        [kode_kegiatan_penghasilan_badan_usaha]
      );
      const pph23 = pph23Result.rows[0];
      if (!pph23) throw new NotFoundError('PPh 23 tidak ditemukan !');

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

      let wajibPajakOrangPribadi;
      let wajibPajakBadanUsaha;
      if (request.target_penerima === 'Wajib Pajak Orang Pribadi') {
        const wajibPajakOrangPribadiResult = await query(
          `SELECT nama, nama_bank, no_rekening, nama_rekening, npwp FROM wajib_pajak_orang_pribadi WHERE nama = $1`,
          [request.nama_penerima]
        );
        wajibPajakOrangPribadi = wajibPajakOrangPribadiResult.rows[0];
        if (!wajibPajakOrangPribadi)
          throw new NotFoundError(
            'Wajib Pajak Orang Pribadi tidak ditemukan !'
          );
      } else {
        const wajibPajakBadanUsahaResult = await query(
          `SELECT nama_badan_usaha, nama_bank, no_rekening, nama_rekening, npwp, masa_berlaku_bebas_pph23, nama_narahubung FROM wajib_pajak_badan_usaha WHERE nama_badan_usaha = $1`,
          [request.nama_penerima]
        );
        wajibPajakBadanUsaha = wajibPajakBadanUsahaResult.rows[0];
        if (!wajibPajakBadanUsaha)
          throw new NotFoundError('Wajib Pajak Badan Usaha tidak ditemukan !');
      }

      const objekPajakResult = await query(
        `SELECT kode_objek_pajak, tarif_npwp,  tarif_non_npwp FROM objek_pajak WHERE kode_objek_pajak = $1`,
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

      const namaBank =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.nama_bank
          : wajibPajakOrangPribadi.nama_bank;
      const noRekening =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.no_rekening
          : wajibPajakOrangPribadi.no_rekening;
      const namaRekening =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.nama_rekening
          : wajibPajakOrangPribadi.nama_rekening;
      const npwp =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.npwp
          : wajibPajakOrangPribadi.npwp;
      const namaNarahubung =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.nama_narahubung
          : null;
      const masaBerlakuBebasPPh23 =
        request.target_penerima === 'Wajib Pajak Badan Usaha'
          ? wajibPajakBadanUsaha.masa_berlaku_bebas_pph23
          : null;

      const tarifNpwp = objekPajak.tarif_npwp;
      const tarifNonNpwp = objekPajak.tarif_non_npwp;

      let tarifPajak = 0;
      let potonganPajak = 0;

      const today = format(new Date().toISOString(), 'dd MMMM yyyy HH:mm:ss', {
        locale: id,
      });

      if (
        masaBerlakuBebasPPh23 &&
        isAfter(new Date(masaBerlakuBebasPPh23), today)
      ) {
        tarifPajak = 0;
        potonganPajak = 0;
      } else {
        tarifPajak = npwp !== null ? tarifNpwp : tarifNonNpwp;
        potonganPajak = (tarifPajak / 100) * request.penghasilan_bruto;
      }

      const penghasilanDiterima = request.penghasilan_bruto - potonganPajak;

      const fieldsToUpdate = [
        'jenis_penghasilan',
        'uraian_kegiatan',
        'no_pengajuan',
        'target_penerima',
        'nama_penerima',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'npwp',
        'nama_narahubung',
        'kode_objek_pajak',
        'penghasilan_bruto',
        'tarif_pajak',
        'potongan_pajak',
        'penghasilan_diterima',
        'pic_pencairan_penghasilan',
        'invoice',
        'faktur_pajak',
        'dokumen_kerjasama_kegiatan',
        'idl',
      ];

      let updateValues = [
        request.jenis_penghasilan,
        request.uraian_kegiatan,
        request.no_pengajuan,
        request.target_penerima,
        request.nama_penerima,
        namaBank,
        noRekening || null,
        namaRekening || null,
        npwp || null,
        namaNarahubung || null,
        request.kode_objek_pajak,
        request.penghasilan_bruto,
        tarifPajak,
        potonganPajak,
        penghasilanDiterima,
        request.pic_pencairan_penghasilan,
        request.invoice,
        request.faktur_pajak,
        request.dokumen_kerjasama_kegiatan,
        request.idl,
      ];

      const updateSet = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE kegiatan_penghasilan_badan_usaha
        SET ${updateSet}
        WHERE kode_kegiatan_penghasilan_badan_usaha = $1
        RETURNING *;
      `;

      const { rows } = await query(updateQuery, [
        kode_kegiatan_penghasilan_badan_usaha,
        ...updateValues,
      ]);

      return toPPh23SingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  static async delete(kode_kegiatan_penghasilan_badan_usaha: string) {
    try {
      const resultsQuery = `DELETE FROM kegiatan_penghasilan_badan_usaha
                            WHERE kode_kegiatan_penghasilan_badan_usaha = $1
                            RETURNING *`;

      const { rows } = await query(resultsQuery, [
        kode_kegiatan_penghasilan_badan_usaha,
      ]);

      return rows.map(toPPh23SingleResponse) as TPPh23SingleModel[];
    } catch (error) {
      throw error;
    }
  }
}
