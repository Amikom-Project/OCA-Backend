import express from 'express';

import AuthRoute from '@/routes/auth-route';

export const publicRouter = express.Router();

publicRouter.use('/api/login', AuthRoute);
