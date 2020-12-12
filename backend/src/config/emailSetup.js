/* eslint-disable no-console */
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

import { accessEnv } from '../utils/accessEnv';
import { logger } from '../utils/logger';
import { SEND_EMAIL_ERROR } from './constants';

export const mailSender = async mailData => {
  const isDev = accessEnv('NODE_ENV') === 'development';
  const isTest = accessEnv('NODE_ENV') === 'test';

  try {
    if (isDev || isTest) {
      const account = await nodemailer.createTestAccount();

      const transporter = await nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: { user: account.user, pass: account.pass },
      });

      const data = {
        from: 'no-reply@chatapp.com',
        to: mailData.emailTo,
        subject: mailData.subject,
        html: mailData.message,
      };

      const info = await transporter.sendMail(data);

      logger.info('Message sent: %s', info.messageId);
      logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else {
      sgMail.setApiKey(accessEnv('SENDGRID_API_KEY'));

      const msg = {
        to: mailData.emailTo,
        from: accessEnv('SENDGRID_API_FROM'),
        subject: mailData.subject,
        html: mailData.message,
      };

      await sgMail.send(msg);
    }
  } catch (error) {
    logger.error(SEND_EMAIL_ERROR, error);
  }
};
