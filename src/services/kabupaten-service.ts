import { query } from '@/configs/database-config';
import { toKabupatenResponse, TKabupatenModel } from '@/types/kabupaten-type';

export class KabupatenService {
  static async list(nama_provinsi: string): Promise<Array<TKabupatenModel>> {
    try {
      const resultsQuery = `
    SELECT kabupaten.kode_kabupaten, kabupaten.nama_kabupaten
    FROM kabupaten
    JOIN provinsi ON kabupaten.kode_provinsi = provinsi.kode_provinsi
    WHERE provinsi.nama_provinsi = $1`;

      const { rows } = await query(resultsQuery, [nama_provinsi]);

      return rows.map(toKabupatenResponse) as TKabupatenModel[];
    } catch (error) {
      throw error;
    }
  }
}
