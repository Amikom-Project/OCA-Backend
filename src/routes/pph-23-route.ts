import express from 'express';

import { PPh23Controller } from '@/controllers/pph-23-controller';

const router = express.Router();

router.post('/', PPh23Controller.create);
router.get('/', PPh23Controller.list);
router.get('/entry', PPh23Controller.listEntry);
router.get('/verifikasi', PPh23Controller.listVerifikasi);
router.get('/setor', PPh23Controller.listSetor);
router.get('/:kode_kegiatan_penghasilan_badan_usaha', PPh23Controller.get);
router.put('/:kode_kegiatan_penghasilan_badan_usaha', PPh23Controller.update);
router.delete(
  '/:kode_kegiatan_penghasilan_badan_usaha',
  PPh23Controller.delete
);

export default router;
