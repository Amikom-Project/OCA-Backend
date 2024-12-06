import { query } from '@/configs/database-config';
import {
  TPengajuanAnggaranModelPagedResult,
  toPagedPengajuanAnggaranResponse,
  toPengajuanAnggaranResponse,
} from '@/types/pengajuan-anggaran-type';

export class PengajuanAnggaranService {
  static async list(
    page: number,
    limit: number,
    idl: string
  ): Promise<TPengajuanAnggaranModelPagedResult> {
    try {
      const currentYear = new Date().getFullYear();
      const previousDecember = `${currentYear - 1}-12-01`;
      const currentDecember = `${currentYear}-12-31`;

      const totalCountQuery = `
                              SELECT COUNT(kode_pengajuan_anggaran) as count
                              FROM pengajuan_anggaran
                              WHERE ($1::text IS NULL OR idl = $1)
                                AND tanggal_pengajuan BETWEEN $2 AND $3
                            `;

      const totalCountResult = await query(totalCountQuery, [
        idl,
        previousDecember,
        currentDecember,
      ]);
      const totalCount = parseInt(totalCountResult.rows[0].count, 10);

      const totalPage = Math.ceil(totalCount / limit);
      const currentPage = page || 1;

      const resultsQuery = `
      SELECT kode_pengajuan_anggaran, kegiatan, no_pengajuan
      FROM pengajuan_anggaran
      WHERE ($1::text IS NULL OR idl = $1)
        AND tanggal_pengajuan BETWEEN $2 AND $3
      LIMIT $4 OFFSET $5
    `;

      const skip = (page - 1) * limit;
      const { rows } = await query(resultsQuery, [
        idl,
        previousDecember,
        currentDecember,
        limit,
        skip,
      ]);

      const pageableData = toPagedPengajuanAnggaranResponse({
        result: rows.map(toPengajuanAnggaranResponse),
        current_page: currentPage,
        total_page: totalPage,
        total_count: totalCount,
      });

      return pageableData;
    } catch (error) {
      throw error;
    }
  }
}
