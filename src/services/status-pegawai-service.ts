import { query } from '@/configs/database-config';
import {
  TStatusPegawaiModel,
  toStatusPegawaiResponse,
} from '@/types/status-pegawai-type';

export class StatusPegawaiService {
  static async list(): Promise<Array<TStatusPegawaiModel>> {
    try {
      const { rows } = await query(
        `SELECT kode_status_pegawai, status_pegawai FROM status_pegawai
              ORDER BY kode_status_pegawai ASC`,
        []
      );

      return rows.map(toStatusPegawaiResponse) as TStatusPegawaiModel[];
    } catch (error) {
      throw error;
    }
  }
}
