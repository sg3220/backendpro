import crypto from 'crypto';
import { promisify } from 'util';
import gJWT from 'jsonwebtoken';
import gUser from './../Models/gUserModel';
import gCatchAsync from './../Utilities/gCatchAsync';
import gAppError from '../Utilities/gAppError';
import gSendEmail from './../Utilities/gEmail';

const gSignToken = id => {
  return gJWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
