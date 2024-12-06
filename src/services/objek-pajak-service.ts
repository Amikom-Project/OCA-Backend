import { query } from '@/configs/database-config';
import {
  TObjekPajakModel,
  toObjekPajakResponse,
} from '@/types/objek-pajak-type';

export class ObjekPajakService {
  static async listObjekPajakPPh21(): Promise<Array<TObjekPajakModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_objek_pajak, objek_pajak, tarif_npwp, tarif_non_npwp FROM objek_pajak WHERE kode_jenis_pajak = 1`,
        []
      );

      return rows.map(toObjekPajakResponse) as TObjekPajakModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listObjekPajakPPh23(): Promise<Array<TObjekPajakModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_objek_pajak, objek_pajak, tarif_npwp, tarif_non_npwp FROM objek_pajak WHERE kode_jenis_pajak = 2`,
        []
      );

      return rows.map(toObjekPajakResponse) as TObjekPajakModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listObjekPajakPPh4Ayat2(): Promise<Array<TObjekPajakModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_objek_pajak, objek_pajak, tarif_npwp, tarif_non_npwp FROM objek_pajak WHERE kode_jenis_pajak = 3`,
        []
      );

      return rows.map(toObjekPajakResponse) as TObjekPajakModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listObjekPajakPPN(): Promise<Array<TObjekPajakModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_objek_pajak, objek_pajak, tarif_npwp, tarif_non_npwp FROM objek_pajak WHERE kode_jenis_pajak IN (4, 5)`,
        []
      );

      return rows.map(toObjekPajakResponse) as TObjekPajakModel[];
    } catch (error) {
      throw error;
    }
  }
}
