import express from 'express';

import { WajibPajakOrangPribadiController } from '@/controllers/wajib-pajak-orang-pribadi-controller';

const router = express.Router();

router.post('/', WajibPajakOrangPribadiController.create);
router.get('/', WajibPajakOrangPribadiController.list);
router.get(
  '/:kode_wajib_pajak_orang_pribadi',
  WajibPajakOrangPribadiController.get
);
router.put(
  '/:kode_wajib_pajak_orang_pribadi',
  WajibPajakOrangPribadiController.update
);
router.delete(
  '/:kode_wajib_pajak_orang_pribadi',
  WajibPajakOrangPribadiController.delete
);
router.get('/option/:nama', WajibPajakOrangPribadiController.option);

export default router;
