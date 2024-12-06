import express from 'express';

import { JenisPenghasilanController } from '@/controllers/jenis-penghasilan-controller';

const router = express.Router();

router.get('/pph-21', JenisPenghasilanController.listJenisPenghasilanPPh21);
router.get('/pph-23', JenisPenghasilanController.listJenisPenghasilanPPh23);
router.get(
  '/pph-4-ayat-2',
  JenisPenghasilanController.listJenisPenghasilanPPh4Ayat2
);

export default router;
