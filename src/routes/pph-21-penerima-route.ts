import express from 'express';

import { PPh21PenerimaController } from '@/controllers/pph-21-penerima-controller';

const router = express.Router();

router.get('/entry', PPh21PenerimaController.listEntry);
router.get('/verifikasi', PPh21PenerimaController.listVerifikasi);
router.get('/setor', PPh21PenerimaController.listSetor);

router.post(
  '/:kode_kegiatan_penghasilan_orang_pribadi',
  PPh21PenerimaController.create
);
router.get(
  '/:kode_kegiatan_penghasilan_orang_pribadi',
  PPh21PenerimaController.list
);
router.put(
  '/:kode_item_kegiatan_penghasilan_orang_pribadi',
  PPh21PenerimaController.update
);
router.get(
  '/:kode_item_kegiatan_penghasilan_orang_pribadi',
  PPh21PenerimaController.get
);

router.delete(
  '/:kode_item_kegiatan_penghasilan_orang_pribadi',
  PPh21PenerimaController.delete
);

export default router;
