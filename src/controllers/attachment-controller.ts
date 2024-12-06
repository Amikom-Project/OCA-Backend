import { Request, Response } from 'express';

import { handleError, NotFoundError } from '@/errors/response-error';
import { AttachmentService } from '@/services/attachment-service';

export class AttachmentController {
  static async download(req: Request, res: Response) {
    try {
      const name = req.query.name;
      if (!name || typeof name !== 'string') {
        throw new NotFoundError('file not found');
      }
      const path = req.query.path;
      if (!path || typeof path !== 'string') {
        throw new NotFoundError('file path required');
      }

      const response = await AttachmentService.download(path, name);

      for (const [key, value] of response.headers.entries()) {
        res.set(key, value);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.status(response.status);
      res.send(buffer);
      return;
    } catch (error) {
      const err = error as Error;
      handleError(res, err);
      console.log('error :', err.message);
    }
  }
}
