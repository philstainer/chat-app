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
const isTest = accessEnv('NODE_ENV') === 'test';

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple(),
    format.timestamp()
  ),
  transports: [
    new transports.Console({
      name: 'console.log',
      level: isProduction ? PROD_LOG_LEVEL : DEV_LOG_LEVEL,
    }),
  ],
});

if (!isProduction && !isTest) {
  logger.debug('Logging initialized at debug level');
}

if (isTest) {
  logger.transports[0].silent = true;
}

export { logger };
