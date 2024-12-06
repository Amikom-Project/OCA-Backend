import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'module-alias/register';

import { ErrorMiddleware } from '@/middlewares/error-middleware';

import { privateRouter } from '@/routes/private-route';
import { publicRouter } from '@/routes/public-route';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: '*',
  })
);

app.use(publicRouter);
app.use(privateRouter);
privateRouter.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
