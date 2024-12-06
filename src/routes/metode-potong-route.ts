import express from 'express';

import { MetodePotongController } from '@/controllers/metode-potong-controller';

const router = express.Router();

router.get(
  '/pegawai-tetap',
  MetodePotongController.listMetodePotongPegawaiTetap
);
router.get(
  '/pegawai-tidak-tetap',
  MetodePotongController.listMetodePotongPegawaiTidakTetap
);
router.get(
  '/bukan-pegawai',
  MetodePotongController.listMetodePotongBukanPegawai
);
router.get(
  '/dewan-komisaris',
  MetodePotongController.listMetodePotongDewanKomisaris
);
router.get(
  '/mantan-pegawai',
  MetodePotongController.listMetodePotongMantanPegawai
);
router.get(
  '/warga-negara-asing',
  MetodePotongController.listMetodePotongWargaNegaraAsing
);

export default router;
