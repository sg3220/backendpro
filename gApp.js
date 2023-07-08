import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

import appError from './Utilities/appError.js';
import globalErrorHandler from './Controllers/errorController.js';
import tourRouter from './Routes/tourRouter.js';
import userRouter from './Routes/userRouter.js';
import reviewRouter from './Routes/reviewRouter.js';
import viewRouter from './Routes/viewRouter.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const gApp = express();
gApp.set('view engine', 'pug');
gApp.set('views', path.join(__dirname, 'gViews'));
gApp.use(express.static(path.join(__dirname, 'gPublic')));
gApp.use(helmet());
if (process.env.NODE_ENV === 'development') {
  gApp.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'cL: gApp.js, 💥: Too Many Requests From This IP, Try Again Later in 1 Hour',
});
gApp.use('/API', limiter);
gApp.use(express.json({ limit: '10kb' }));
gApp.use(express.urlencoded({ extended: true, limit: '10kb' }));
gApp.use(cookieParser());
gApp.use(mongoSanitize());
gApp.use(xss());
gApp.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
gApp.use((gReq, gRes, gNext) => {
  gReq.requestTime = new Date().toISOString();
  console.log(gReq.cookies);
  gNext();
});
