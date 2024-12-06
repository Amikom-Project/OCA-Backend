import axios from 'axios';
import jwt from 'jsonwebtoken';

import { query } from '@/configs/database-config';
import { GET_EXTERNAL_OCA_BASE_URL } from '@/configs/env-config';
import { TAuthModel } from '../types/auth-type';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@/errors/response-error';

export class AuthService {
  static async login(param: TAuthModel): Promise<any> {
    try {
      const authUrl = `${GET_EXTERNAL_OCA_BASE_URL()}/auth`;
      await axios.post(authUrl, {
        user_id: param.user_id,
        password: param.password,
      });

      const result = await query(
        `SELECT nip, idl, status, nama_pegawai, nama_satker
         FROM agent_pegawai_satuan_kerja
         WHERE nip = $1`,
        [param.user_id]
      );

      const agentPegawai = result.rows[0];
      if (!agentPegawai)
        throw new NotFoundError('Agent atau Pegawai tidak ditemukan!');
      if (agentPegawai.status !== 'Aktif')
        throw new BadRequestError('Agent tidak Aktif!');

      const secretKey = process.env.JWT_SECRET_KEY || '';
      const expiresIn = 6000;
      const token = jwt.sign(
        {
          nip: agentPegawai.nip,
          nama_pegawai: agentPegawai.nama_pegawai,
          idl: agentPegawai.idl,
          nama_satker: agentPegawai.nama_satker,
        },
        secretKey,
        { expiresIn }
      );

      return { access_token: token, expires_in: expiresIn };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new UnauthorizedError(
          'NIP atau Password yang anda masukan salah!'
        );
      }
      throw error;
    }
  }

  static async getAuthToken(): Promise<string> {
    const authUrl = `${GET_EXTERNAL_OCA_BASE_URL()}/auth`;

    const authResponse = await axios.post(authUrl, {
      user_id: process.env.OCA_USER_ID,
      password: process.env.OCA_PASSWORD,
    });

    const token = authResponse.data?.result?.access_token;
    if (!token) {
      throw new Error('Failed to retrieve authentication token.');
    }

    return token;
  }
}
