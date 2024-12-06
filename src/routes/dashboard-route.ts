import express from 'express';

import { DashboardController } from '@/controllers/dashboard-controller';

const router = express.Router();

router.get('/', DashboardController.count);

export default router;
