import jwt from 'jsonwebtoken';

import { generateCookie } from '../utils/generateCookie';
import { accessEnv } from '../utils/accessEnv';
import { FakeObjectId } from '../utils/fixtures';

jest.mock('jsonwebtoken');
jest.mock('../utils/accessEnv');

test('should generate JWT token with data', () => {
  const jwtMock = jest.fn();
  jwt.sign.mockImplementation(jwtMock);

  const jwtSecret = 'jwtSecret';
  accessEnv.mockImplementation(() => jwtSecret);

  const data = { sub: FakeObjectId() };
  const ctx = { res: { cookie: jest.fn() } };
  generateCookie(data, null, ctx);

  expect(jwtMock).toHaveBeenCalledWith(data, jwtSecret);
});

test('should set cookie with name using ctx', () => {
  const token = 'token here';
  jwt.sign.mockImplementation(() => token);

  const data = { sub: FakeObjectId() };
  const name = 'token';
  const ctx = { res: { cookie: jest.fn() } };
  generateCookie(data, name, ctx);

  expect(ctx.res.cookie).toHaveBeenCalledWith(
    name,
    token,
    expect.objectContaining({})
  );
});

test('should set secure cookie for production', () => {
  jwt.sign.mockImplementation(() => 'token');

  accessEnv.mockImplementation(() => 'production');

  const ctx = { res: { cookie: jest.fn() } };
  generateCookie({}, 'name', ctx);

  expect(ctx.res.cookie).toHaveBeenCalledWith(
    'name',
    'token',
    expect.objectContaining({ secure: true })
  );
});

test('should override options', () => {
  jwt.sign.mockImplementation(() => 'token');

  const ctx = { res: { cookie: jest.fn() } };
  const options = { secure: true, newProperty: true };
  generateCookie({}, 'name', ctx, options);

  expect(ctx.res.cookie).toHaveBeenCalledWith(
    'name',
    'token',
    expect.objectContaining(options)
  );
});
