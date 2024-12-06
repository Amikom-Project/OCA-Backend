import { query } from '@/configs/database-config';
import { TBankModel, toBankResponse } from '@/types/bank-type';

export class BankService {
  static async list(): Promise<Array<TBankModel>> {
    try {
      const { rows } = await query(`SELECT kode_bank, nama_bank FROM bank`, []);

      return rows.map(toBankResponse) as TBankModel[];
    } catch (error) {
      throw error;
    }
  }
}
