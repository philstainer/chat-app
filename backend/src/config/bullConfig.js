import Queue from 'bull';

import { accessEnv } from '#utils/accessEnv';

// Initiating the Queue with a redis instance
export const sendMailQueue = new Queue('sendMail', accessEnv('REDIS_URL'));
