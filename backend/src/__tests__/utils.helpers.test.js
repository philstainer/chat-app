import faker from 'faker';

import { RefreshToken } from '#graphql/user/refreshToken.model';
import { accessEnv } from '#utils/accessEnv';
import { FakeUser } from '#utils/fixtures';
import * as helpers from '#utils/helpers';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('#utils/accessEnv.js');
jest.mock('#graphql/user/refreshToken.model.js');

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
