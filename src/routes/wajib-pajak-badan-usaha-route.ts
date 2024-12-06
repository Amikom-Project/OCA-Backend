import express from 'express';

import { WajibPajakBadanUsahaController } from '@/controllers/wajib-pajak-badan-usaha-controller';

const router = express.Router();

router.post('/', WajibPajakBadanUsahaController.create);
router.get('/', WajibPajakBadanUsahaController.list);
router.get(
  '/:kode_wajib_pajak_badan_usaha',
  WajibPajakBadanUsahaController.get
);
router.put(
  '/:kode_wajib_pajak_badan_usaha',
  WajibPajakBadanUsahaController.update
);
router.delete(
  '/:kode_wajib_pajak_badan_usaha',
  WajibPajakBadanUsahaController.delete
);

export default router;
