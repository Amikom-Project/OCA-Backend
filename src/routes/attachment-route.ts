import express from 'express';

import { AttachmentController } from '@/controllers/attachment-controller';

const router = express.Router();

router.get('/download', AttachmentController.download);

export default router;
