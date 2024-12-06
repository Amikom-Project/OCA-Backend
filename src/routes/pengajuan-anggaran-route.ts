import express from 'express';

import { PengajuanAnggaranController } from '@/controllers/pengajuan-anggaran-controller';

const router = express.Router();

router.get('/', PengajuanAnggaranController.list);

export default router;
