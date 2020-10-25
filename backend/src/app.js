import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { apolloServer } from './graphql/apolloServer';
import { accessEnv } from './utils/accessEnv';

const app = express();

// Set Secure Cookies
app.use(cookieParser(accessEnv('BACKEND_COOKIE_SECRET')));

// Compress All Responses
app.use(compression());

apolloServer.applyMiddleware({ app, cors: false, path: '/graphql' });

export { app };
