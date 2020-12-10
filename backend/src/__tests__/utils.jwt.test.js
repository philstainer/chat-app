import faker from 'faker';
import jwt from 'jsonwebtoken';

import { signJWT, verifyJWT, defaultOptions } from '../utils/jwt';
import { accessEnv } from '../utils/accessEnv';

jest.mock('../utils/accessEnv.js');

describe('signJWT', () => {
  test('should sign token with payload and options', async () => {
    const payload = { username: faker.internet.userName() };
    const options = { subject: faker.random.uuid() };

    const secret = 'secret';
    accessEnv.mockImplementationOnce(() => secret);

    const newToken = signJWT(payload, options);

    const verified = jwt.verify(newToken, secret);

    expect(verified).toMatchObject({
      ...payload,
      sub: options.subject,
      iss: defaultOptions.issuer,
    });
  });
});

describe('verifyJWT', () => {
  test('should return verified token', async () => {
    const payload = { username: faker.internet.userName() };
    const options = { subject: faker.random.uuid() };

    const secret = 'secret';
    accessEnv
      .mockImplementationOnce(() => secret)
      .mockImplementationOnce(() => secret);

    const newToken = signJWT(payload, options);

    const verified = verifyJWT(newToken);

    expect(verified).toMatchObject({ ...payload, sub: options.subject });
  });

  test('should return false when verify failed', async () => {
    const payload = { username: faker.internet.userName() };
    const options = { subject: faker.random.uuid(), expiresIn: '-1m' };

    const secret = 'secret';
    accessEnv.mockImplementationOnce(() => secret);

    const newToken = signJWT(payload, options);

    const verified = verifyJWT(newToken);

    expect(verified).toBe(false);
  });
});
