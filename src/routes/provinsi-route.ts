import express from 'express';

import { ProvinsiController } from '@/controllers/provinsi-controller';

const router = express.Router();

router.get('/', ProvinsiController.list);

export default router;
