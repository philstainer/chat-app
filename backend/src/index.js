import { createServer } from 'http';
import { app } from './app';
import { apolloServer } from './graphql/apolloServer';

import { accessEnv } from './utils/accessEnv';
import { logger } from './utils/logger';
import { db } from './config/dbConnection';

const PORT = accessEnv('PORT', 4000);

(async () => {
  await db.connect();

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  await httpServer.listen(PORT, () => {
    logger.info(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    logger.info(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
    );
  });
})();
