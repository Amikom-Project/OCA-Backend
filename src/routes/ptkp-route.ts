import express from 'express';

import { PtkpController } from '@/controllers/ptkp-controller';

const router = express.Router();

router.get('/', PtkpController.list);

export default router;
