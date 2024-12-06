import express from 'express';

import { ObjekPajakController } from '@/controllers/objek-pajak-controller';

const router = express.Router();

router.get('/pph-21', ObjekPajakController.listObjekPajakPPh21);
router.get('/pph-23', ObjekPajakController.listObjekPajakPPh23);
router.get('/pph-4-ayat-2', ObjekPajakController.listObjekPajakPPh4Ayat2);
router.get('/ppn', ObjekPajakController.listObjekPajakPPN);

export default router;
