import { createLogger, format, transports } from 'winston';
import { accessEnv } from './accessEnv';

const LoggerLevel = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly',
};

const PROD_LOG_LEVEL = LoggerLevel.error;
const DEV_LOG_LEVEL = LoggerLevel.debug;

const isProduction = accessEnv('NODE_ENV') === 'production';

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple(),
    format.timestamp()
  ),
  transports: [
    new transports.Console({
      level: isProduction ? PROD_LOG_LEVEL : DEV_LOG_LEVEL,
    }),
  ],
});

if (!isProduction) {
  logger.debug('Logging initialized at debug level');
}

export { logger };
