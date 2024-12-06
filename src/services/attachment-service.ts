import axios from 'axios';
import mime from 'mime-types';

import { GET_EXTERNAL_OCA_BASE_URL } from '@/configs/env-config';
import { AuthService } from '@/services/auth-service';
import { BadRequestError } from '@/errors/response-error';

export class AttachmentService {
  static async upload(
    path: string,
    fileName: string,
    mime: string,
    fileBase64: string
  ) {
    try {
      const token = await AuthService.getAuthToken();

      const ocaUploadUrl = `${GET_EXTERNAL_OCA_BASE_URL()}/owncloud/upload`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const axiosInstance = axios.create({
        baseURL: ocaUploadUrl,
        timeout: 10000,
        headers: headers,
      });

      const uploadResponse = await axiosInstance.post('', {
        path: path,
        name: fileName,
        mime: mime,
        data: fileBase64,
      });

      return uploadResponse.data.fileUrl;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.response?.data);
        throw new Error('Upload file gagal');
      }
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async download(path: string, name: string) {
    try {
      const mimeTypes = mime.lookup(name);
      if (!mimeTypes) {
        throw new BadRequestError('Invalid MIME types');
      }

      const token = await AuthService.getAuthToken();
      const url = new URL(`${GET_EXTERNAL_OCA_BASE_URL()}/owncloud/download`);

      url.searchParams.set('path', path);
      url.searchParams.set('name', name);
      url.searchParams.set('mime', mimeTypes as string);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download file gagal');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}
