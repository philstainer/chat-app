import { mailSender } from '../config/emailSetup';
import { sendMailQueue } from '../config/bullConfig';

const resetPasswordEmail = (emailTo, link, name) => {
  const subject = 'Reset your email';
  const body = `<p>Dear ${name},</p>
  <p>We heard that you lost your password. Sorry about that!</p>
  <p>But don’t worry! You can use the following link to reset your password:</p>
  <a href="${link}" class="button">Reset Password</a>
  <p>Thanks.</p>`;

  const options = {
    attempts: 2,
  };
  const data = { emailTo, subject, body };

  // Producer: adds jobs to queue, in this case emails to be sent out upon
  // password reset request
  sendMailQueue.add(data, options);
};

const registrationEmail = (emailTo, link, name) => {
  const subject = 'Welcome to Chat-App';
  const body = `<p>Dear ${name},</p>
  <p>We are thrilled to have you.</p>
  <p>Some random message with link</p>
  <a href="${link}" class="button">Confirm email</a>
  <p>Thanks.</p>`;

  const options = {
    attempts: 2,
  };
  const data = { emailTo, subject, message: body };

  // Producer: adds jobs to queue, in this case emails to be sent out upon
  // signup
  sendMailQueue.add(data, options);
};

// Consumer: this gets called each time the producer receives a new email.
sendMailQueue.process(async job => {
  mailSender(job.data);
});

export const notifications = { registrationEmail, resetPasswordEmail };
