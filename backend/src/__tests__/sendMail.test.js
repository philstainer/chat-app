import sgMail from '@sendgrid/mail';
import faker from 'faker';

import { sendEmail } from '../utils/mail';
import { accessEnv } from '../utils/accessEnv';
import { SEND_MAIL_ERROR, MAIL_VALIDATION_ERROR } from '../utils/constants';
import { sendEmailSchema } from '../utils/schemas';

jest.mock('@sendgrid/mail');
jest.mock('../utils/logger.js');
jest.mock('../utils/accessEnv.js');
jest.mock('../utils/schemas.js');

test('should set api key', async () => {
  const apiKey = 'secret';
  accessEnv.mockImplementationOnce(() => apiKey);

  const setApiKeyMock = jest.fn();
  sgMail.setApiKey.mockImplementationOnce(setApiKeyMock);

  await sendEmail();

  expect(setApiKeyMock).toHaveBeenCalledWith(apiKey);
});

test('should validate data', async () => {
  const validateMock = jest.fn();
  sendEmailSchema.validateAsync.mockImplementationOnce(validateMock);

  await sendEmail();

  expect(validateMock).toHaveBeenCalled();
});

test('should throw error when validate fails', async () => {
  sendEmailSchema.validateAsync.mockImplementationOnce(() => Promise.reject());

  await expect(() => sendEmail()).rejects.toThrow(MAIL_VALIDATION_ERROR);
});

test('should throw/log error', async () => {
  sgMail.send.mockImplementationOnce(() => Promise.reject());

  await expect(() => sendEmail()).rejects.toThrow(SEND_MAIL_ERROR);
});

test('should send email', async () => {
  const sendMock = jest.fn();
  sgMail.send.mockImplementationOnce(sendMock);

  const data = {
    to: faker.internet.email(),
    from: faker.internet.email(),
    subject: faker.lorem.sentence(10),
    html: '<div>html content</div>',
  };

  await sendEmail(data);

  expect(sendMock).toHaveBeenCalledWith(data);
});
