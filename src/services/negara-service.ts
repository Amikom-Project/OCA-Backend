import { query } from '@/configs/database-config';
import { TNegaraModel, toNegaraResponse } from '@/types/negara-type';

export class NegaraService {
  static async list(): Promise<Array<TNegaraModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_negara, nama_negara FROM negara`,
        []
      );

      return rows.map(toNegaraResponse) as TNegaraModel[];
    } catch (error) {
      throw error;
    }
  }
}
