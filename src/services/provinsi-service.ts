import { query } from '@/configs/database-config';
import { TProvinsiModel, toProvinsiResponse } from '@/types/provinsi-type';

export class ProvinsiService {
  static async list(): Promise<Array<TProvinsiModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_provinsi, nama_provinsi FROM provinsi`,
        []
      );

      return rows.map(toProvinsiResponse) as TProvinsiModel[];
    } catch (error) {
      throw error;
    }
  }
}
