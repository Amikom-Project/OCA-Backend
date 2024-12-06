import express from 'express';

import { InventarisasiPajakController } from '@/controllers/inventarisasi-pajak-controller';

const router = express.Router();

router.post('/', InventarisasiPajakController.create);
router.get('/', InventarisasiPajakController.list);
router.get('/:kode_inventarisasi_pajak', InventarisasiPajakController.get);
router.put('/:kode_inventarisasi_pajak', InventarisasiPajakController.update);
router.delete(
  '/:kode_inventarisasi_pajak',
  InventarisasiPajakController.delete
);

export default router;
