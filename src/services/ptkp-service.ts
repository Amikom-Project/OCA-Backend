import { query } from '@/configs/database-config';
import { TPtkpModel, toPtkpResponse } from '@/types/ptkp-type';

export class PtkpService {
  static async list(): Promise<Array<TPtkpModel>> {
    try {
      const { rows } = await query(`SELECT kode_ptkp, ptkp FROM ptkp`, []);

      return rows.map(toPtkpResponse) as TPtkpModel[];
    } catch (error) {
      throw error;
    }
  }
}
