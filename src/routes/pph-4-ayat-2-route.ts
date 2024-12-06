import express from 'express';

import { PPh4Ayat2Controller } from '@/controllers/pph-4-ayat-2-controller';

const router = express.Router();

router.post('/', PPh4Ayat2Controller.create);
router.get('/', PPh4Ayat2Controller.list);
router.get('/entry', PPh4Ayat2Controller.listEntry);
router.get('/verifikasi', PPh4Ayat2Controller.listVerifikasi);
router.get('/setor', PPh4Ayat2Controller.listSetor);
router.get('/:kode_kegiatan_penghasilan_badan_usaha', PPh4Ayat2Controller.get);
router.put(
  '/:kode_kegiatan_penghasilan_badan_usaha',
  PPh4Ayat2Controller.update
);
router.delete(
  '/:kode_kegiatan_penghasilan_badan_usaha',
  PPh4Ayat2Controller.delete
);

export default router;
