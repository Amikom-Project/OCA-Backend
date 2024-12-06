import { query } from '@/configs/database-config';
import { TCountPPh, toCountPPhResponse } from '@/types/dashboard-type';

export class DashboardService {
  static async count(idl: string): Promise<TCountPPh> {
    try {
      const queries = [
        query(
          `SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) FROM item_kegiatan_penghasilan_orang_pribadi WHERE status = 'Entry' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) FROM item_kegiatan_penghasilan_orang_pribadi WHERE status = 'Verifikasi' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_item_kegiatan_penghasilan_orang_pribadi) FROM item_kegiatan_penghasilan_orang_pribadi WHERE status = 'Setor' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) FROM kegiatan_penghasilan_badan_usaha WHERE kode_jenis_pajak = 2 AND status = 'Entry' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) FROM kegiatan_penghasilan_badan_usaha WHERE kode_jenis_pajak = 2 AND status = 'Verifikasi' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) FROM kegiatan_penghasilan_badan_usaha WHERE kode_jenis_pajak = 2 AND status = 'Setor' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) FROM kegiatan_penghasilan_badan_usaha WHERE kode_jenis_pajak = 3 AND status = 'Entry' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) FROM kegiatan_penghasilan_badan_usaha WHERE kode_jenis_pajak = 3 AND status = 'Verifikasi' AND idl = $1`,
          [idl]
        ),
        query(
          `SELECT COUNT(kode_kegiatan_penghasilan_badan_usaha) FROM kegiatan_penghasilan_badan_usaha WHERE kode_jenis_pajak = 3 AND status = 'Setor' AND idl = $1`,
          [idl]
        ),
      ];

      const [
        pph21EntryRes,
        pph21VerifikasiRes,
        pph21SetorRes,
        pph23EntryRes,
        pph23VerifikasiRes,
        pph23SetorRes,
        pph4Ayat2EntryRes,
        pph4Ayat2VerifikasiRes,
        pph4Ayat2SetorRes,
      ] = await Promise.all(queries);

      const result: TCountPPh = {
        pph_21_entry: parseInt(pph21EntryRes.rows[0].count, 10),
        pph_21_verifikasi: parseInt(pph21VerifikasiRes.rows[0].count, 10),
        pph_21_setor: parseInt(pph21SetorRes.rows[0].count, 10),
        pph_23_entry: parseInt(pph23EntryRes.rows[0].count, 10),
        pph_23_verifikasi: parseInt(pph23VerifikasiRes.rows[0].count, 10),
        pph_23_setor: parseInt(pph23SetorRes.rows[0].count, 10),
        pph_4_ayat_2_entry: parseInt(pph4Ayat2EntryRes.rows[0].count, 10),
        pph_4_ayat_2_verifikasi: parseInt(
          pph4Ayat2VerifikasiRes.rows[0].count,
          10
        ),
        pph_4_ayat_2_setor: parseInt(pph4Ayat2SetorRes.rows[0].count, 10),
      };

      return toCountPPhResponse(result);
    } catch (error) {
      throw error;
    }
  }
}
