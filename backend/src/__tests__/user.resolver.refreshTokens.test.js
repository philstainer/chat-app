import { refreshTokens } from '#graphql/user/resolvers/refreshTokens';
import { signAsync, decodeAsync } from '#utils/jwt';
import { generateRefreshToken } from '#utils/generateRefreshToken';
import { setCookie } from '#utils/setCookie';
import { RefreshToken } from '#graphql/user/refreshToken.model';
import {
  INVALID_REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN,
  TOKEN_NOT_EXPIRED,
} from '#config/constants';
import { FakeToken, FakeObjectId } from '#utils/fixtures';

jest.mock('#graphql/user/refreshToken.model.js');
jest.mock('#utils/jwt');
jest.mock('#utils/generateRefreshToken');
jest.mock('#utils/setCookie');

test('should throw error then refresh token does not exist', async () => {
  await expect(() => refreshTokens()).rejects.toThrow(
    INVALID_REFRESH_TOKEN_ERROR
  );
});

test('should throw error when token is not expired', async () => {
  const exp = Math.floor(Date.now() / 1000) + 15000;

  decodeAsync.mockImplementationOnce(() => ({
    exp,
  }));

  const ctx = {
    req: {
      signedCookies: {
        [REFRESH_TOKEN]: 'token',
      },
    },
  };
  await expect(() => refreshTokens(null, null, ctx)).rejects.toThrow(
    TOKEN_NOT_EXPIRED
  );
});

test('should throw error when refresh token not found', async () => {
  const exp = Math.floor(Date.now() / 1000) - 15000;
  decodeAsync.mockImplementationOnce(() => ({ exp }));

  const refreshTokenMock = {
    findOne: () => refreshTokenMock,
    populate: () => null,
  };
  RefreshToken.findOne.mockImplementationOnce(refreshTokenMock.findOne);

  const ctx = {
    req: {
      signedCookies: {
        [REFRESH_TOKEN]: 'token',
      },
    },
    res: {
      clearCookie: jest.fn(),
    },
  };
  await expect(() => refreshTokens(null, null, ctx)).rejects.toThrow(
    INVALID_REFRESH_TOKEN_ERROR
  );
  expect(ctx.res.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN);
});

test('should throw error when refresh token is not active', async () => {
  const exp = Math.floor(Date.now() / 1000) - 15000;
  decodeAsync.mockImplementationOnce(() => ({ exp }));

  const refreshTokenMock = {
    findOne: () => refreshTokenMock,
    populate: () => ({ isActive: false }),
  };
  RefreshToken.findOne.mockImplementationOnce(refreshTokenMock.findOne);

  const ctx = {
    req: {
      signedCookies: {
        [REFRESH_TOKEN]: 'token',
      },
    },
    res: {
      clearCookie: jest.fn(),
    },
  };
  await expect(() => refreshTokens(null, null, ctx)).rejects.toThrow(
    INVALID_REFRESH_TOKEN_ERROR
  );
  expect(ctx.res.clearCookie).toHaveBeenCalledWith(REFRESH_TOKEN);
});

test('should generate new refresh token and deactivate existing refresh token', async () => {
  const exp = Math.floor(Date.now() / 1000) - 15000;
  decodeAsync.mockImplementationOnce(() => ({ exp }));

  const foundRefreshToken = {
    isActive: true,
    save: jest.fn(),
    user: { _id: FakeObjectId() },
  };
  const refreshTokenMock = {
    findOne: () => refreshTokenMock,
    populate: () => foundRefreshToken,
  };
  RefreshToken.findOne.mockImplementationOnce(refreshTokenMock.findOne);

  const newRefreshToken = { token: FakeToken() };
  const refreshMock = jest.fn(() => newRefreshToken);
  generateRefreshToken.mockImplementationOnce(refreshMock);

  const ctx = {
    req: { signedCookies: { [REFRESH_TOKEN]: 'token' } },
    res: { cookie: jest.fn() },
  };
  await refreshTokens(null, null, ctx);

  expect(refreshMock).toHaveBeenCalled();
  expect(foundRefreshToken).toMatchObject(foundRefreshToken);
  expect(foundRefreshToken.save).toHaveBeenCalled();
});

test('should generate new access token, set refresh token cookie and return token', async () => {
  const exp = Math.floor(Date.now() / 1000) - 15000;
  decodeAsync.mockImplementationOnce(() => ({ exp }));

  const foundRefreshToken = {
    isActive: true,
    save: jest.fn(),
    user: { _id: FakeObjectId() },
  };
  const refreshTokenMock = {
    findOne: () => refreshTokenMock,
    populate: () => foundRefreshToken,
  };
  RefreshToken.findOne.mockImplementationOnce(refreshTokenMock.findOne);

  const newRefreshToken = { token: FakeToken() };
  generateRefreshToken.mockImplementationOnce(() => newRefreshToken);

  const newAccessToken = FakeToken();
  const signMock = jest.fn(() => newAccessToken);
  signAsync.mockImplementationOnce(signMock);

  const setCookieMock = jest.fn();
  setCookie.mockImplementationOnce(setCookieMock);

  const ctx = {
    req: { signedCookies: { [REFRESH_TOKEN]: 'token' } },
    res: { cookie: jest.fn() },
  };
  const result = await refreshTokens(null, null, ctx);

  expect(signMock).toHaveBeenCalledWith({ sub: foundRefreshToken.user._id });
  expect(setCookieMock).toHaveBeenCalledWith(
    REFRESH_TOKEN,
    newRefreshToken.token,
    ctx.res
  );
  expect(result.token).toBe(newAccessToken);
});
