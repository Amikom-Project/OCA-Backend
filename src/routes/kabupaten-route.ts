import express from 'express';

import { KabupatenController } from '@/controllers/kabupaten-controller';

const router = express.Router();

router.get('/', KabupatenController.list);

export default router;
