import { sendMailQueue } from '#config/bullConfig';
import { mailSender } from '#config/emailSetup';

sendMailQueue.process(async job => {
  mailSender(job.data);
});
