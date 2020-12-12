import faker from 'faker';
import { sign, verify } from 'jsonwebtoken';
import { hash } from 'bcryptjs';

import { RefreshToken } from '../graphql/user/refreshToken.model';
import { accessEnv } from '../utils/accessEnv';
import { FakeUser, FakeToken } from '../utils/fixtures';
import * as helpers from '../utils/helpers';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../utils/accessEnv.js');
jest.mock('../graphql/user/refreshToken.model.js');

describe('randomTokenString', () => {
  test('should return random hex string', async () => {
    const randomToken = helpers.randomTokenString();

    expect(randomToken).toHaveLength(80);
  });

  test('should return random hex string with custom length', async () => {
    const randomToken = helpers.randomTokenString(20);

    expect(randomToken).toHaveLength(40);
  });
});

describe('hashPassword', () => {
  test('should return hashed password', async () => {
    const password = faker.internet.password(8);

    const hashMock = jest.fn(() => password);
    hash.mockImplementationOnce(hashMock);

    const result = await helpers.hashPassword(password);

    expect(hashMock).toHaveBeenCalled();

    expect(result).toEqual(password);
  });
});

describe('setTokenCookie', () => {
  test('should set cookie on res', async () => {
    const name = 'token name';
    const token = 'token';
    const res = {
      cookie: jest.fn(),
    };

    helpers.setTokenCookie(name, token, res);

    expect(res.cookie).toHaveBeenCalledWith(name, token, expect.anything());
  });

  test('should set cookie to non secure when not in production', async () => {
    accessEnv.mockImplementationOnce(() => 'development');

    const name = 'token name';
    const token = 'token';
    const res = {
      cookie: jest.fn(),
    };

    helpers.setTokenCookie(name, token, res);

    expect(res.cookie).toHaveBeenCalledWith(
      name,
      token,
      expect.objectContaining({ secure: false })
    );
  });

  test('should set cookie to secure in production', async () => {
    accessEnv.mockImplementationOnce(() => 'production');

    const name = 'token name';
    const token = 'token';
    const res = {
      cookie: jest.fn(),
    };

    helpers.setTokenCookie(name, token, res);

    expect(res.cookie).toHaveBeenCalledWith(
      name,
      token,
      expect.objectContaining({ secure: true })
    );
  });
});

describe('generateRefreshToken', () => {
  test('should create and return new refresh token', async () => {
    const user = FakeUser();
    const ipAddress = faker.internet.ip();

    const createdRefreshToken = { _id: faker.random.uuid() };
    const createMock = jest.fn(() => createdRefreshToken);
    RefreshToken.create.mockImplementationOnce(createMock);

    const refreshToken = await helpers.generateRefreshToken(user, ipAddress);

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ createdByIp: ipAddress, user: user._id })
    );
    expect(refreshToken).toBe(createdRefreshToken);
  });
});

describe('generateJwtToken', () => {
  test('should generate jwt token with user', async () => {
    const user = FakeUser();

    const secret = 'secret123';
    accessEnv.mockImplementationOnce(() => secret);

    const token = FakeToken();
    const signMock = jest.fn(() => token);
    sign.mockImplementationOnce(signMock);

    const result = await helpers.generateJwtToken(user);

    expect(signMock).toHaveBeenCalledWith(
      { sub: user._id },
      secret,
      expect.anything()
    );

    expect(result).toBe(token);
  });

  test('should reject with error when failed to sign token', async () => {
    const user = FakeUser();

    const errorMessage = 'Failed to verify token';
    sign.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    await expect(() => helpers.generateJwtToken(user)).rejects.toThrow(
      errorMessage
    );
  });
});

describe('verifyJwtToken', () => {
  test('should remove Bearer from jwt token', async () => {
    const token = FakeToken();
    const bearerToken = `Bearer ${token}`;

    const secret = 'secret123';
    accessEnv.mockImplementationOnce(() => secret);

    const verifyMock = jest.fn();
    verify.mockImplementationOnce(verifyMock);

    await helpers.verifyJwtToken(bearerToken);

    expect(verifyMock).toHaveBeenCalledWith(token, secret, expect.anything());
  });

  test('should verify jwt token', async () => {
    const token = FakeToken();

    const secret = 'secret123';
    accessEnv.mockImplementationOnce(() => secret);

    const verifyMock = jest.fn(() => token);
    verify.mockImplementationOnce(verifyMock);

    const result = await helpers.verifyJwtToken(token);

    expect(verifyMock).toHaveBeenCalledWith(token, secret, expect.anything());

    expect(result).toBe(token);
  });

  test('should return false when failed to verify token', async () => {
    const token = FakeToken();

    verify.mockImplementationOnce(() => {
      throw new Error('Failed to verify token');
    });

    const result = await helpers.verifyJwtToken(token);

    expect(result).toBe(false);
  });
});
