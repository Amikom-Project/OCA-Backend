import express from 'express';

import { StatusPegawaiController } from '@/controllers/status-pegawai-controller';

const router = express.Router();

router.get('/', StatusPegawaiController.list);

export default router;
