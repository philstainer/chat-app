import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { accessEnv } from './utils/accessEnv';

const app = express();

// Set Secure Cookies
app.use(cookieParser(accessEnv('BACKEND_COOKIE_SECRET')));

// Compress All Responses
app.use(compression());

export { app };
