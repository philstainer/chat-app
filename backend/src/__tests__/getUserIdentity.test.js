import jwt from 'jsonwebtoken';

import { getUserIdentity } from '../utils/getUserIdentity';
import { accessEnv } from '../utils/accessEnv';

jest.mock('jsonwebtoken');
jest.mock('../utils/accessEnv.js');

test('should verify and set userId on request if token exists', () => {
  const tokenData = { sub: 12345 };
  const jwtMock = jest.fn(() => tokenData);
  jwt.verify.mockImplementation(jwtMock);

  const jwtSecret = 'secret';
  accessEnv.mockImplementation(() => jwtSecret);

  const req = { signedCookies: { token: 'aasda' } };
  const next = () => {};

  getUserIdentity(req, null, next);

  expect(jwtMock).toHaveBeenCalledWith(req.signedCookies.token, jwtSecret);
  expect(req).toMatchObject({ userId: tokenData.sub });
});

test('should call next', () => {
  const next = jest.fn();

  getUserIdentity(null, null, next);

  expect(next).toHaveBeenCalled();
});
