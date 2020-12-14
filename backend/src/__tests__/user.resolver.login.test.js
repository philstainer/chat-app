import faker from 'faker';
import bcrypt from 'bcryptjs';
import { login } from '#graphql/user/resolvers/login';
import { User } from '#graphql/user/user.model';
import { signAsync } from '#utils/jwt';

import { USER_NOT_FOUND_ERROR, REFRESH_TOKEN } from '#config/constants';
import { FakeObjectId, FakeToken, FakeUser } from '#utils/fixtures';
import { generateRefreshToken } from '#utils/generateRefreshToken';
import { setCookie } from '#utils/setCookie';

jest.mock('#utils/setCookie');
jest.mock('#utils/jwt');
jest.mock('#utils/accessEnv.js');
jest.mock('#utils/generateRefreshToken.js');
jest.mock('#graphql/user/user.model.js');
jest.mock('bcryptjs', () => ({ compare: jest.fn(() => true) }));

test('should throw error when user not found', async () => {
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: () => userMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  await expect(() => login()).rejects.toThrow(USER_NOT_FOUND_ERROR);
  expect(userMock.findOne).toHaveBeenCalled();
});

test('should throw error when password compare fails', async () => {
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const passwordMock = jest.fn(() => false);
  bcrypt.compare.mockImplementationOnce(passwordMock);

  await expect(() => login()).rejects.toThrow(USER_NOT_FOUND_ERROR);
  expect(passwordMock).toHaveBeenCalled();
});

test('should generate tokens and set refresh cookie', async () => {
  // FindOne Mock
  const foundUser = FakeUser();
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => foundUser,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  bcrypt.compare.mockResolvedValueOnce(true);

  const signMock = jest.fn();
  signAsync.mockImplementationOnce(signMock);

  const refreshToken = { token: FakeToken() };
  const refreshTokenMock = jest.fn(() => refreshToken);
  generateRefreshToken.mockImplementationOnce(refreshTokenMock);

  const setTokenMock = jest.fn();
  setCookie.mockImplementationOnce(setTokenMock);

  const ctx = { req: { ip: faker.internet.ip() }, res: {} };
  await login(null, null, ctx, null);

  expect(signMock).toHaveBeenCalledWith({ sub: foundUser._id });
  expect(refreshTokenMock).toHaveBeenCalledWith(foundUser, ctx.req.ip);
  expect(setTokenMock).toHaveBeenCalledWith(
    REFRESH_TOKEN,
    refreshToken.token,
    ctx.res
  );
});

test('should return token', async () => {
  const user = {
    _id: FakeObjectId(),
    email: faker.internet.email(),
  };

  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const token = FakeToken();
  signAsync.mockResolvedValueOnce(token);

  generateRefreshToken.mockResolvedValueOnce({ token: FakeToken() });

  const ctx = { req: { ip: faker.internet.ip() }, res: {} };
  const result = await login(null, null, ctx);

  expect(result.token).toBe(token);
});
