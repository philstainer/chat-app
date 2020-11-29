import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { apolloServer } from './graphql/apolloServer';
import { accessEnv } from './utils/accessEnv';
import { getUserIdentity } from './utils/getUserIdentity';

const app = express();

// Set Secure Cookies
app.use(cookieParser(accessEnv('BACKEND_COOKIE_SECRET')));

// Compress All Responses
app.use(compression());

// Cors
app.use(cors({ credentials: true, origin: true }));

// Populate req.
app.use(getUserIdentity);

apolloServer.applyMiddleware({ app, cors: false, path: '/graphql' });

export { app };
