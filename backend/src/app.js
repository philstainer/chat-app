import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { apolloServer } from './graphql/apolloServer';
import { accessEnv } from './utils/accessEnv';
import { getUserIdentity } from './utils/getUserIdentity';

const app = express();

// Set Secure Cookies
app.use(cookieParser(accessEnv('BACKEND_COOKIE_SECRET')));

// Compress All Responses
app.use(compression());

// Populate req.
app.use(getUserIdentity);

const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: ['x-access-token'],
};

apolloServer.applyMiddleware({ app, cors: corsOptions, path: '/graphql' });

export { app };
