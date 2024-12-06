import { query } from '@/configs/database-config';
import {
  TJenisPenghasilanModel,
  toJenisPenghasilanResponse,
} from '@/types/jenis-penghasilan-type';

export class JenisPenghasilanService {
  static async listJenisPenghasilanPPh21(): Promise<
    Array<TJenisPenghasilanModel>
  > {
    try {
      const { rows } = await query(
        `SELECT kode_jenis_penghasilan, jenis_penghasilan FROM jenis_penghasilan WHERE jenis_pajak_terkait IN (1, 12, 13)`,
        []
      );

      return rows.map(toJenisPenghasilanResponse) as TJenisPenghasilanModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listJenisPenghasilanPPh23(): Promise<
    Array<TJenisPenghasilanModel>
  > {
    try {
      const { rows } = await query(
        `SELECT kode_jenis_penghasilan, jenis_penghasilan FROM jenis_penghasilan WHERE jenis_pajak_terkait IN (2, 12)`,
        []
      );

      return rows.map(toJenisPenghasilanResponse) as TJenisPenghasilanModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listJenisPenghasilanPPh4Ayat2(): Promise<
    Array<TJenisPenghasilanModel>
  > {
    try {
      const { rows } = await query(
        `SELECT kode_jenis_penghasilan, jenis_penghasilan FROM jenis_penghasilan WHERE jenis_pajak_terkait IN (3, 13)`,
        []
      );

      return rows.map(toJenisPenghasilanResponse) as TJenisPenghasilanModel[];
    } catch (error) {
      throw error;
    }
  }
}
