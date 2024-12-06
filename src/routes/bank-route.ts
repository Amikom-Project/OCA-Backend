import express from 'express';

import { BankController } from '@/controllers/bank-controller';

const router = express.Router();

router.get('/', BankController.list);

export default router;
