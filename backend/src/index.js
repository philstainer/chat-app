import { app } from './app';
import { accessEnv } from './utils/accessEnv';
import { logger } from './utils/logger';

const PORT = accessEnv('PORT', 4000);

(async () => {
  await app.listen(PORT, () =>
    logger.info('🚀 Started on http://localhost:4000/')
  );
})();
