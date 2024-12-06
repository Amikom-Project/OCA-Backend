import express from 'express';

import { PPh21KegiatanController } from '@/controllers/pph-21-kegiatan-controller';

const router = express.Router();

router.post('/', PPh21KegiatanController.create);
router.get('/', PPh21KegiatanController.list);
router.get(
  '/:kode_kegiatan_penghasilan_orang_pribadi',
  PPh21KegiatanController.get
);
router.put(
  '/:kode_kegiatan_penghasilan_orang_pribadi',
  PPh21KegiatanController.update
);
router.delete(
  '/:kode_kegiatan_penghasilan_orang_pribadi',
  PPh21KegiatanController.delete
);

export default router;
