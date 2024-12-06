import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { formatInTimeZone } from 'date-fns-tz';

import { query } from '@/configs/database-config';
import { PPh21PenerimaValidation } from '@/validations/pph-21-penerima-validation';
import { BadRequestError, NotFoundError } from '@/errors/response-error';
import {
  TPPh21PenerimaCreateFormSchema,
  TPPh21PenerimaModelPagedResult,
  TPPh21PenerimaSingleModel,
  TPPh21PenerimaUpdateFormSchema,
  toPPh21PenerimaSingleResponse,
  toPagedPPh21PenerimaResponse,
} from '@/types/pph-21-penerima-type';

export class PPh21PenerimaService {
  static async create(
    data: TPPh21PenerimaCreateFormSchema
  ): Promise<TPPh21PenerimaSingleModel> {
    try {
      const request = PPh21PenerimaValidation.parse(data);

      const kode_item_kegiatan_penghasilan_orang_pribadi = uuidv4();
      const tanggal_input = formatInTimeZone(
        new Date(),
        'Asia/Jakarta',
        'dd MMMM yyyy HH:mm:ss'
      );

      const kegiatanPenghasilanOrangPribadiResult = await query(
        `SELECT kode_kegiatan_penghasilan_orang_pribadi FROM kegiatan_penghasilan_orang_pribadi WHERE kode_kegiatan_penghasilan_orang_pribadi = $1`,
        [request.kode_kegiatan_penghasilan_orang_pribadi]
      );
      const kegiatanPenghasilanOrangPribadi =
        kegiatanPenghasilanOrangPribadiResult.rows[0];
      if (!kegiatanPenghasilanOrangPribadi)
        throw new NotFoundError(
          'Kode Kegiatan Penghasilan Orang Pribadi tidak ditemukan !'
        );

      const wajibPajakOrangPribadiResult = await query(
        `SELECT nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, kewarganegaraan, ptkp FROM wajib_pajak_orang_pribadi WHERE nama = $1`,
        [request.nama]
      );
      const wajibPajakOrangPribadi = wajibPajakOrangPribadiResult.rows[0];
      if (!wajibPajakOrangPribadi)
        throw new NotFoundError('Wajib Pajak Orang Pribadi tidak ditemukan !');

      const objekPajakResult = await query(
        `SELECT kode_objek_pajak, tarif_npwp,  tarif_non_npwp FROM objek_pajak WHERE kode_objek_pajak = $1`,
        [request.kode_objek_pajak]
      );
      const objekPajak = objekPajakResult.rows[0];
      if (!objekPajak)
        throw new NotFoundError('Kode Objek Pajak tidak ditemukan !');

      const metodePotongResult = await query(
        `SELECT metode_potong, koefisien, pengurang, penambah FROM metode_potong WHERE metode_potong = $1`,
        [request.metode_potong]
      );
      const metodePotong = metodePotongResult.rows[0];
      if (!metodePotong)
        throw new NotFoundError('Metode Potong tidak ditemukan !');

      const satuanKerjaResult = await query(
        `SELECT idl FROM satuan_kerja WHERE idl = $1`,
        [request.idl]
      );
      const satuanKerja = satuanKerjaResult.rows[0];
      if (!satuanKerja) throw new NotFoundError('IDL tidak ditemukan !');

      const ptkpResult = await query(
        `SELECT ptkp, kategori_ptkp FROM ptkp WHERE ptkp = $1`,
        [wajibPajakOrangPribadi.ptkp]
      );
      const ptkp = ptkpResult.rows[0];
      if (!ptkp) throw new NotFoundError('Kategori tidak ditemukan !');

      const terbulananResult = await query(
        `SELECT tarif
         FROM terbulanan
         WHERE kategori = $1
         AND batas_bawah <= $2
         AND (batas_atas >= $2 OR batas_atas = 0)
         LIMIT 1`,
        [ptkp.kategori_ptkp, request.penghasilan_bruto]
      );
      const terbulanan = terbulananResult.rows[0];
      if (!terbulanan) throw new NotFoundError('Tarif tidak ditemukan !');

      const nama = wajibPajakOrangPribadi.nama;
      const statusPegawai = wajibPajakOrangPribadi.status_pegawai;
      const nik = wajibPajakOrangPribadi.nik;
      const noPassport = wajibPajakOrangPribadi.no_passport;
      const npwp = wajibPajakOrangPribadi.npwp;
      const namaBank = wajibPajakOrangPribadi.nama_bank;
      const noRekening = wajibPajakOrangPribadi.no_rekening;
      const namaRekening = wajibPajakOrangPribadi.nama_rekening;
      const kewarganegaraan = wajibPajakOrangPribadi.kewarganegaraan;

      const tarifNpwp = objekPajak.tarif_npwp;
      const tarifNonNpwp = objekPajak.tarif_non_npwp;

      const koefisien = metodePotong.koefisien;
      const pengurang = metodePotong.pengurang;
      const penambah = metodePotong.penambah;

      const tarifTerbulanan = terbulanan.tarif;

      let tarifBerlaku = 0;
      let potonganPajak = 0;

      if (
        request.metode_potong === 'PT Pisah Gaji' ||
        request.metode_potong === 'TER bulanan'
      ) {
        tarifBerlaku = tarifTerbulanan;
        potonganPajak = Math.floor(
          (tarifBerlaku / 100) *
            koefisien *
            (request.penghasilan_bruto - pengurang) +
            penambah
        );
      } else {
        tarifBerlaku = npwp !== null ? tarifNpwp : tarifNonNpwp;
        potonganPajak =
          (tarifBerlaku / 100) *
            koefisien *
            (request.penghasilan_bruto - pengurang) +
          penambah;
      }
      const penghasilanDiterima = request.penghasilan_bruto - potonganPajak;

      let insertFields = [
        'kode_item_kegiatan_penghasilan_orang_pribadi',
        'kode_kegiatan_penghasilan_orang_pribadi',
        'nama',
        'status_pegawai',
        'npwp',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'metode_potong',
        'kode_objek_pajak',
        'penghasilan_bruto',
        'tarif_berlaku',
        'potongan_pajak',
        'penghasilan_diterima',
        'status',
        'idl',
        'tanggal_input',
      ];

      let insertValues = [
        kode_item_kegiatan_penghasilan_orang_pribadi,
        request.kode_kegiatan_penghasilan_orang_pribadi,
        nama,
        statusPegawai,
        npwp,
        namaBank,
        noRekening,
        namaRekening,
        request.metode_potong,
        request.kode_objek_pajak,
        request.penghasilan_bruto,
        tarifBerlaku,
        potonganPajak,
        penghasilanDiterima,
        'Entry',
        request.idl,
        tanggal_input,
      ];

      if (kewarganegaraan === 'WNI') {
        if (!insertFields.includes('nik')) {
          insertFields.push('nik');
          insertValues.push(nik);
        }
      } else {
        if (!insertFields.includes('no_passport')) {
          insertFields.push('no_passport');
          insertValues.push(noPassport);
        }
      }

      const placeholders = insertValues
        .map((_, index) => `$${index + 1}`)
        .join(', ');

      const insertQuery = `
        INSERT INTO item_kegiatan_penghasilan_orang_pribadi
        (${insertFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;

      const { rows } = await query(insertQuery, insertValues);

      return toPPh21PenerimaSingleResponse(rows[0]);
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
    kode_kegiatan_penghasilan_orang_pribadi: string,
    idl: string,
    search?: string
  ): Promise<TPPh21PenerimaModelPagedResult> {
    try {
      const searchQuery = search
        ? `AND (LOWER(nama) LIKE $3 OR LOWER(status_pegawai) LIKE $3 OR LOWER(metode_potong) LIKE $3)`
        : '';

      const totalCountQuery = `
    SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) as count
    FROM item_kegiatan_penghasilan_orang_pribadi
    WHERE ($2::text IS NULL OR idl = $2)
    AND kode_kegiatan_penghasilan_orang_pribadi = $1
    ${searchQuery}
  `;

      const totalCountParams = search
        ? [
            kode_kegiatan_penghasilan_orang_pribadi,
            idl,
            `%${search.toLowerCase()}%`,
          ]
        : [kode_kegiatan_penghasilan_orang_pribadi, idl];

      const totalCountResult = await query(totalCountQuery, totalCountParams);
      const totalCount = parseInt(totalCountResult.rows[0].count, 10);

      const totalPage = Math.ceil(totalCount / limit);
      const currentPage = page || 1;

      const resultsQuery = `
    SELECT kode_item_kegiatan_penghasilan_orang_pribadi, kode_kegiatan_penghasilan_orang_pribadi, nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, metode_potong, kode_objek_pajak, penghasilan_bruto, tarif_berlaku, potongan_pajak, penghasilan_diterima, status, idl, tanggal_input
        FROM item_kegiatan_penghasilan_orang_pribadi
    WHERE ($2::text IS NULL OR idl = $2)
    AND kode_kegiatan_penghasilan_orang_pribadi = $1
    ${searchQuery}
    ORDER BY tanggal_input DESC
    LIMIT $${search ? 4 : 3} OFFSET $${search ? 5 : 4}
  `;

      const skip = (page - 1) * limit;

      const resultsParams = search
        ? [
            kode_kegiatan_penghasilan_orang_pribadi,
            idl,
            `%${search.toLowerCase()}%`,
            limit,
            skip,
          ]
        : [kode_kegiatan_penghasilan_orang_pribadi, idl, limit, skip];

      const { rows } = await query(resultsQuery, resultsParams);

      const pageableData = toPagedPPh21PenerimaResponse({
        result: rows.map(toPPh21PenerimaSingleResponse),
        current_page: currentPage,
        total_page: totalPage,
        total_count: totalCount,
      });

      return pageableData;
    } catch (error) {
      throw error;
    }
  }

  static async listEntry(
    page: number,
    limit: number,
    idl: string,
    search?: string
  ): Promise<TPPh21PenerimaModelPagedResult> {
    const searchQuery = search
      ? `AND (LOWER(nama) LIKE $2 OR LOWER(status_pegawai) LIKE $2 OR LOWER(metode_potong) LIKE $2)`
      : '';

    const totalCountQuery = `
      SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) as count
      FROM item_kegiatan_penghasilan_orang_pribadi
      WHERE ($1::text IS NULL OR idl = $1) AND status = 'Entry'
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
      SELECT kode_item_kegiatan_penghasilan_orang_pribadi, kode_kegiatan_penghasilan_orang_pribadi, nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, metode_potong, kode_objek_pajak, penghasilan_bruto, tarif_berlaku, potongan_pajak, penghasilan_diterima, status, idl, tanggal_input
      FROM item_kegiatan_penghasilan_orang_pribadi
      WHERE ($1::text IS NULL OR idl = $1) AND status = 'Entry'
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

    const skip = (page - 1) * limit;

    const resultsParams = search
      ? [idl, `%${search.toLowerCase()}%`, limit, skip]
      : [idl, limit, skip];

    const { rows } = await query(resultsQuery, resultsParams);

    const pageableData = toPagedPPh21PenerimaResponse({
      result: rows.map(toPPh21PenerimaSingleResponse),
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
  ): Promise<TPPh21PenerimaModelPagedResult> {
    try {
      const searchQuery = search
        ? `AND (LOWER(nama) LIKE $2 OR LOWER(status_pegawai) LIKE $2 OR LOWER(metode_potong) LIKE $2)`
        : '';

      const totalCountQuery = `
      SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) as count
      FROM item_kegiatan_penghasilan_orang_pribadi
      WHERE ($1::text IS NULL OR idl = $1) AND status = 'Verifikasi'
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
      SELECT kode_item_kegiatan_penghasilan_orang_pribadi, kode_kegiatan_penghasilan_orang_pribadi, nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, metode_potong, kode_objek_pajak, penghasilan_bruto, tarif_berlaku, potongan_pajak, penghasilan_diterima, status, idl, tanggal_input
      FROM item_kegiatan_penghasilan_orang_pribadi
      WHERE ($1::text IS NULL OR idl = $1) AND status = 'Verifikasi'
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

      const skip = (page - 1) * limit;

      const resultsParams = search
        ? [idl, `%${search.toLowerCase()}%`, limit, skip]
        : [idl, limit, skip];

      const { rows } = await query(resultsQuery, resultsParams);

      const pageableData = toPagedPPh21PenerimaResponse({
        result: rows.map(toPPh21PenerimaSingleResponse),
        current_page: currentPage,
        total_page: totalPage,
        total_count: totalCount,
      });

      return pageableData;
    } catch (error) {
      throw error;
    }
  }

  static async listSetor(
    page: number,
    limit: number,
    idl: string,
    search?: string
  ): Promise<TPPh21PenerimaModelPagedResult> {
    try {
      const searchQuery = search
        ? `AND (LOWER(nama) LIKE $2 OR LOWER(status_pegawai) LIKE $2 OR LOWER(metode_potong) LIKE $2)`
        : '';

      const totalCountQuery = `
      SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) as count
      FROM item_kegiatan_penghasilan_orang_pribadi
      WHERE ($1::text IS NULL OR idl = $1) AND status = 'Setor'
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
      SELECT kode_item_kegiatan_penghasilan_orang_pribadi, kode_kegiatan_penghasilan_orang_pribadi, nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, metode_potong, kode_objek_pajak, penghasilan_bruto, tarif_berlaku, potongan_pajak, penghasilan_diterima, status, idl, tanggal_input
      FROM item_kegiatan_penghasilan_orang_pribadi
      WHERE ($1::text IS NULL OR idl = $1) AND status = 'Setor'
      ${searchQuery}
      ORDER BY tanggal_input DESC
      LIMIT $${search ? 3 : 2} OFFSET $${search ? 4 : 3}
    `;

      const skip = (page - 1) * limit;

      const resultsParams = search
        ? [idl, `%${search.toLowerCase()}%`, limit, skip]
        : [idl, limit, skip];

      const { rows } = await query(resultsQuery, resultsParams);

      const pageableData = toPagedPPh21PenerimaResponse({
        result: rows.map(toPPh21PenerimaSingleResponse),
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
    kode_item_kegiatan_penghasilan_orang_pribadi: string
  ): Promise<TPPh21PenerimaSingleModel> {
    try {
      const queryText = `
        SELECT kode_item_kegiatan_penghasilan_orang_pribadi, kode_kegiatan_penghasilan_orang_pribadi, nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, metode_potong, kode_objek_pajak, penghasilan_bruto, tarif_berlaku, potongan_pajak, penghasilan_diterima, status, idl, tanggal_input
        FROM item_kegiatan_penghasilan_orang_pribadi
        WHERE kode_item_kegiatan_penghasilan_orang_pribadi = $1
      `;

      const { rows } = await query(queryText, [
        kode_item_kegiatan_penghasilan_orang_pribadi,
      ]);

      return toPPh21PenerimaSingleResponse(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async update(
    kode_item_kegiatan_penghasilan_orang_pribadi: string,
    data: TPPh21PenerimaUpdateFormSchema
  ): Promise<TPPh21PenerimaSingleModel> {
    try {
      const request = PPh21PenerimaValidation.parse(data);

      const pph21PenerimaResult = await query(
        `SELECT kode_item_kegiatan_penghasilan_orang_pribadi FROM item_kegiatan_penghasilan_orang_pribadi WHERE kode_item_kegiatan_penghasilan_orang_pribadi = $1`,
        [kode_item_kegiatan_penghasilan_orang_pribadi]
      );
      const pph21Penerima = pph21PenerimaResult.rows[0];
      if (!pph21Penerima)
        throw new NotFoundError('PPh 21 Penerima tidak ditemukan !');

      const wajibPajakOrangPribadiResult = await query(
        `SELECT nama, status_pegawai, nik, no_passport, npwp, nama_bank, no_rekening, nama_rekening, kewarganegaraan, ptkp FROM wajib_pajak_orang_pribadi WHERE nama = $1`,
        [request.nama]
      );
      const wajibPajakOrangPribadi = wajibPajakOrangPribadiResult.rows[0];
      if (!wajibPajakOrangPribadi)
        throw new NotFoundError('Wajib Pajak Orang Pribadi tidak ditemukan !');

      const objekPajakResult = await query(
        `SELECT kode_objek_pajak, tarif_npwp,  tarif_non_npwp FROM objek_pajak WHERE kode_objek_pajak = $1`,
        [request.kode_objek_pajak]
      );
      const objekPajak = objekPajakResult.rows[0];
      if (!objekPajak)
        throw new NotFoundError('Kode Objek Pajak tidak ditemukan !');

      const metodePotongResult = await query(
        `SELECT metode_potong, koefisien, pengurang, penambah FROM metode_potong WHERE metode_potong = $1`,
        [request.metode_potong]
      );
      const metodePotong = metodePotongResult.rows[0];
      if (!metodePotong)
        throw new NotFoundError('Metode Potong tidak ditemukan !');

      const satuanKerjaResult = await query(
        `SELECT idl FROM satuan_kerja WHERE idl = $1`,
        [request.idl]
      );
      const satuanKerja = satuanKerjaResult.rows[0];
      if (!satuanKerja) throw new NotFoundError('IDL tidak ditemukan !');

      const ptkpResult = await query(
        `SELECT ptkp, kategori_ptkp FROM ptkp WHERE ptkp = $1`,
        [wajibPajakOrangPribadi.ptkp]
      );
      const ptkp = ptkpResult.rows[0];
      if (!ptkp) throw new NotFoundError('Kategori tidak ditemukan !');

      const terbulananResult = await query(
        `SELECT tarif
         FROM terbulanan
         WHERE kategori = $1
         AND batas_bawah <= $2
         AND (batas_atas >= $2 OR batas_atas = 0)
         LIMIT 1`,
        [ptkp.kategori_ptkp, request.penghasilan_bruto]
      );
      const terbulanan = terbulananResult.rows[0];
      if (!terbulanan) throw new NotFoundError('Tarif tidak ditemukan !');

      const nama = wajibPajakOrangPribadi.nama;
      const statusPegawai = wajibPajakOrangPribadi.status_pegawai;
      const nik = wajibPajakOrangPribadi.nik;
      const noPassport = wajibPajakOrangPribadi.no_passport;
      const npwp = wajibPajakOrangPribadi.npwp;
      const namaBank = wajibPajakOrangPribadi.nama_bank;
      const noRekening = wajibPajakOrangPribadi.no_rekening;
      const namaRekening = wajibPajakOrangPribadi.nama_rekening;
      const kewarganegaraan = wajibPajakOrangPribadi.kewarganegaraan;

      const tarifNpwp = objekPajak.tarif_npwp;
      const tarifNonNpwp = objekPajak.tarif_non_npwp;

      const koefisien = metodePotong.koefisien;
      const pengurang = metodePotong.pengurang;
      const penambah = metodePotong.penambah;

      const tarifTerbulanan = terbulanan.tarif;

      let tarifBerlaku = 0;
      let potonganPajak = 0;

      if (
        request.metode_potong === 'PT Pisah Gaji' ||
        request.metode_potong === 'TER bulanan'
      ) {
        tarifBerlaku = tarifTerbulanan;
        potonganPajak = potonganPajak = Math.floor(
          (tarifBerlaku / 100) *
            koefisien *
            (request.penghasilan_bruto - pengurang) +
            penambah
        );
      } else {
        tarifBerlaku = npwp !== null ? tarifNpwp : tarifNonNpwp;
        potonganPajak =
          (tarifBerlaku / 100) *
            koefisien *
            (request.penghasilan_bruto - pengurang) +
          penambah;
      }
      const penghasilanDiterima = request.penghasilan_bruto - potonganPajak;

      const fieldsToUpdate = [
        'nama',
        'status_pegawai',
        'npwp',
        'nama_bank',
        'no_rekening',
        'nama_rekening',
        'metode_potong',
        'kode_objek_pajak',
        'penghasilan_bruto',
        'tarif_berlaku',
        'potongan_pajak',
        'penghasilan_diterima',
        'idl',
      ];

      let updateValues = [
        nama,
        statusPegawai,
        npwp,
        namaBank,
        noRekening,
        namaRekening,
        request.metode_potong,
        request.kode_objek_pajak,
        request.penghasilan_bruto,
        tarifBerlaku,
        potonganPajak,
        penghasilanDiterima,
        request.idl,
      ];

      if (kewarganegaraan === 'WNI') {
        fieldsToUpdate.push('nik');
        updateValues.push(nik);
      }

      if (kewarganegaraan === 'WNA') {
        fieldsToUpdate.push('no_passport');
        updateValues.push(noPassport);
      }

      const updateSet = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE item_kegiatan_penghasilan_orang_pribadi
        SET ${updateSet}
        WHERE kode_item_kegiatan_penghasilan_orang_pribadi = $1
        RETURNING *;
      `;

      const { rows } = await query(updateQuery, [
        kode_item_kegiatan_penghasilan_orang_pribadi,
        ...updateValues,
      ]);

      return toPPh21PenerimaSingleResponse(rows[0]);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError(
          `${error.errors.map((error) => error.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  static async delete(kode_item_kegiatan_penghasilan_orang_pribadi: string) {
    try {
      const resultsQuery = `DELETE FROM item_kegiatan_penghasilan_orang_pribadi
                            WHERE kode_item_kegiatan_penghasilan_orang_pribadi = $1
                            RETURNING *`;

      const { rows } = await query(resultsQuery, [
        kode_item_kegiatan_penghasilan_orang_pribadi,
      ]);

      return rows.map(
        toPPh21PenerimaSingleResponse
      ) as TPPh21PenerimaSingleModel[];
    } catch (error) {
      throw error;
    }
  }
}
