import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { accessEnv } from '../utils/accessEnv';
import { wsAuthentication } from '../utils/wsAuthentication';
import { AUTH_LOGGED_OUT_ERROR } from '../utils/constants';

jest.mock('../utils/accessEnv');
jest.mock('jsonwebtoken');
jest.mock('cookie-parser');

test('should decode signedCookie', () => {
  const webSocket = { upgradeReq: { headers: { cookie: 'cookie' } } };

  const cookieMock = jest.fn();
  cookieParser.signedCookie = cookieMock;

  const verifyMock = () => ({ sub: new mongoose.Types.ObjectId() });
  jwt.verify.mockImplementationOnce(verifyMock);

  wsAuthentication(webSocket);

  expect(cookieMock).toHaveBeenCalled();
});

test('should verify jwt token', () => {
  const webSocket = { upgradeReq: { headers: { cookie: 'cookie' } } };

  const cookie = 'cookie';
  cookieParser.signedCookie = () => cookie;

  const verifyMock = jest.fn(() => ({ sub: new mongoose.Types.ObjectId() }));
  jwt.verify.mockImplementationOnce(verifyMock);

  const cookieSecret = 'cookie-secret';
  const jwtSecret = 'jwt-secret';
  accessEnv
    .mockImplementationOnce(() => cookieSecret)
    .mockImplementationOnce(() => jwtSecret);

  wsAuthentication(webSocket);

  expect(verifyMock).toHaveBeenCalledWith(cookie, jwtSecret);
});

test('should throw error if userId is invalid', async () => {
  const webSocket = { upgradeReq: { headers: { cookie: 'cookie' } } };

  const verifyMock = () => ({ sub: '12345' });
  jwt.verify.mockImplementationOnce(verifyMock);

  await expect(() => wsAuthentication(webSocket)).rejects.toThrow(
    AUTH_LOGGED_OUT_ERROR
  );
});

test('should return userId', async () => {
  const webSocket = { upgradeReq: { headers: { cookie: 'cookie' } } };

  const sub = new mongoose.Types.ObjectId();
  jwt.verify.mockImplementationOnce(() => ({ sub }));

  const result = await wsAuthentication(webSocket);

  expect(result).toBe(sub);
});
