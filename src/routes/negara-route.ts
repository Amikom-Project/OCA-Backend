import express from 'express';

import { NegaraController } from '@/controllers/negara-controller';

const router = express.Router();

router.get('/', NegaraController.list);

export default router;
