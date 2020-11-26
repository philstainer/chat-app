import sgMail from '@sendgrid/mail';

import { accessEnv } from './accessEnv';
import { logger } from './logger';
import { SEND_MAIL_ERROR, MAIL_VALIDATION_ERROR } from './constants';
import { sendEmailSchema } from './schemas';

export const sendEmail = async (data) => {
  sgMail.setApiKey(accessEnv('SENDGRID_API_KEY'));

  // Validate
  try {
    await sendEmailSchema.validateAsync(data);
  } catch (error) {
    logger.error(MAIL_VALIDATION_ERROR, error);
    throw new Error(MAIL_VALIDATION_ERROR);
  }

  // Send email
  try {
    await sgMail.send(data);
  } catch (error) {
    logger.error(SEND_MAIL_ERROR, error);
    throw new Error(SEND_MAIL_ERROR);
  }
};
