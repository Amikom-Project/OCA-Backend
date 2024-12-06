import { query } from '@/configs/database-config';
import {
  TMetodePotongModel,
  toMetodePotongResponse,
} from '@/types/metode-potong-type';

export class MetodePotongService {
  static async listMetodePotongPegawaiTetap(): Promise<
    Array<TMetodePotongModel>
  > {
    try {
      const { rows } = await query(
        `SELECT sp.status_pegawai, mp.metode_potong
         FROM metode_potong mp
         JOIN status_pegawai sp ON mp.kode_status_pegawai = sp.kode_status_pegawai
         WHERE mp.kode_status_pegawai = 1
         OR mp.kode_metode_potong IN (1, 2, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16)
         ORDER BY mp.kode_metode_potong`,
        []
      );

      return rows.map(toMetodePotongResponse) as TMetodePotongModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listMetodePotongPegawaiTidakTetap(): Promise<
    Array<TMetodePotongModel>
  > {
    try {
      const { rows } = await query(
        `SELECT sp.status_pegawai, mp.metode_potong
         FROM metode_potong mp
         JOIN status_pegawai sp ON mp.kode_status_pegawai = sp.kode_status_pegawai
         WHERE mp.kode_status_pegawai = 2
         OR mp.kode_metode_potong IN (3, 4, 5, 6, 7, 8, 9)
         ORDER BY mp.kode_metode_potong`,
        []
      );

      return rows.map(toMetodePotongResponse) as TMetodePotongModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listMetodePotongBukanPegawai(): Promise<
    Array<TMetodePotongModel>
  > {
    try {
      const { rows } = await query(
        `SELECT sp.status_pegawai, mp.metode_potong
         FROM metode_potong mp
         JOIN status_pegawai sp ON mp.kode_status_pegawai = sp.kode_status_pegawai
         WHERE mp.kode_status_pegawai = 3
         OR mp.kode_metode_potong IN (7, 8, 9)
         ORDER BY mp.kode_metode_potong`,
        []
      );

      return rows.map(toMetodePotongResponse) as TMetodePotongModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listMetodePotongDewanKomisaris(): Promise<
    Array<TMetodePotongModel>
  > {
    try {
      const { rows } = await query(
        `SELECT sp.status_pegawai, mp.metode_potong
         FROM metode_potong mp
         JOIN status_pegawai sp ON mp.kode_status_pegawai = sp.kode_status_pegawai
         WHERE mp.kode_status_pegawai = 4
         OR mp.kode_metode_potong IN (3)
         ORDER BY mp.kode_metode_potong`,
        []
      );

      return rows.map(toMetodePotongResponse) as TMetodePotongModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listMetodePotongMantanPegawai(): Promise<
    Array<TMetodePotongModel>
  > {
    try {
      const { rows } = await query(
        `SELECT sp.status_pegawai, mp.metode_potong
         FROM metode_potong mp
         JOIN status_pegawai sp ON mp.kode_status_pegawai = sp.kode_status_pegawai
         WHERE mp.kode_status_pegawai = 5
         OR mp.kode_metode_potong IN (7, 8, 9, 10, 11)
         ORDER BY mp.kode_metode_potong`,
        []
      );

      return rows.map(toMetodePotongResponse) as TMetodePotongModel[];
    } catch (error) {
      throw error;
    }
  }

  static async listMetodePotongWargaNegaraAsing(): Promise<
    Array<TMetodePotongModel>
  > {
    try {
      const { rows } = await query(
        `SELECT sp.status_pegawai, mp.metode_potong
         FROM metode_potong mp
         JOIN status_pegawai sp ON mp.kode_status_pegawai = sp.kode_status_pegawai
         WHERE mp.kode_status_pegawai = 6
         ORDER BY mp.kode_metode_potong`,
        []
      );

      return rows.map(toMetodePotongResponse) as TMetodePotongModel[];
    } catch (error) {
      throw error;
    }
  }
}
