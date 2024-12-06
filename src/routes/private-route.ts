import express from 'express';

import { AuthMiddleware } from '@/middlewares/auth-middleware';

import BankRoute from '@/routes/bank-route';
import NegaraRoute from '@/routes/negara-route';
import StatusPegawaiRoute from '@/routes/status-pegawai-route';
import MetodePotongRoute from '@/routes/metode-potong-route';
import PtkpRoute from '@/routes/ptkp-route';
import JenisPenghasilanRoute from '@/routes/jenis-penghasilan-route';
import ObjekPajakRoute from '@/routes/objek-pajak-route';
import PengajuanAnggaranRoute from '@/routes/pengajuan-anggaran-route';
import ProvinsiRoute from '@/routes/provinsi-route';
import KabupatenRoute from '@/routes/kabupaten-route';
import WajibPajakBadanUsahaRoute from '@/routes/wajib-pajak-badan-usaha-route';
import PPh23Route from '@/routes/pph-23-route';
import PPh4Ayat2Route from '@/routes/pph-4-ayat-2-route';
import InventarisasiPajakRoute from '@/routes/inventarisasi-pajak-route';
import WajibPajakOrangPribadiRoute from '@/routes/wajib-pajak-orang-pribadi-route';
import PPh21KegiatanRoute from '@/routes/pph-21-kegiatan-route';
import PPh21PenerimaRoute from '@/routes/pph-21-penerima-route';
import DashboardRoute from '@/routes/dashboard-route';
import AttachmentRoute from '@/routes/attachment-route';

export const privateRouter = express.Router();
privateRouter.use(AuthMiddleware.verifyToken);

privateRouter.use('/api/bank', BankRoute);
privateRouter.use('/api/negara', NegaraRoute);
privateRouter.use('/api/status-pegawai', StatusPegawaiRoute);
privateRouter.use('/api/metode-potong', MetodePotongRoute);
privateRouter.use('/api/ptkp', PtkpRoute);
privateRouter.use('/api/jenis-penghasilan', JenisPenghasilanRoute);
privateRouter.use('/api/objek-pajak', ObjekPajakRoute);
privateRouter.use('/api/pengajuan-anggaran', PengajuanAnggaranRoute);
privateRouter.use('/api/provinsi', ProvinsiRoute);
privateRouter.use('/api/kabupaten', KabupatenRoute);
privateRouter.use('/api/wajib-pajak-badan-usaha', WajibPajakBadanUsahaRoute);
privateRouter.use('/api/pph-23', PPh23Route);
privateRouter.use('/api/pph-4-ayat-2', PPh4Ayat2Route);
privateRouter.use('/api/inventarisasi-pajak', InventarisasiPajakRoute);
privateRouter.use(
  '/api/wajib-pajak-orang-pribadi',
  WajibPajakOrangPribadiRoute
);
privateRouter.use('/api/pph-21-kegiatan', PPh21KegiatanRoute);
privateRouter.use('/api/pph-21-penerima', PPh21PenerimaRoute);
privateRouter.use('/api/dashboard', DashboardRoute);
privateRouter.use('/api/attachment', AttachmentRoute);
