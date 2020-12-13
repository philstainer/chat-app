import faker from 'faker';
import bcrypt from 'bcryptjs';
import { login } from '#graphql/user/resolvers/login';
import { User } from '#graphql/user/user.model';
import { selectedFields } from '#utils/selectedFields';

import { USER_NOT_FOUND_ERROR, REFRESH_TOKEN } from '#config/constants';
import { FakeObjectId, FakeToken } from '#utils/fixtures';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '#utils/helpers';

jest.mock('#utils/accessEnv.js');
jest.mock('#utils/selectedFields.js');
jest.mock('#utils/helpers.js');
jest.mock('#graphql/user/user.model.js');
jest.mock('bcryptjs', () => ({ compare: jest.fn(() => true) }));

test('should call selectFields', async () => {
  const fieldsMock = jest.fn();
  selectedFields.mockImplementationOnce(fieldsMock);

  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const info = { name: 1 };
  await login(null, null, null, info);

  expect(fieldsMock).toHaveBeenCalledWith(info);
});

test('should get user via email', async () => {
  const selected = '_id name';
  selectedFields.mockImplementationOnce(() => selected);

  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const args = {
    input: {
      email: faker.internet.email(),
      password: faker.internet.password(8),
    },
  };

  await login(null, args, null, null);

  expect(userMock.findOne).toHaveBeenCalledWith(
    expect.objectContaining({ email: args.input.email })
  );
  expect(userMock.select).toHaveBeenCalledWith(`${selected} password`);
  expect(userMock.lean).toHaveBeenCalled();
});

test('should throw error when user not found', async () => {
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  await expect(() => login()).rejects.toThrow(USER_NOT_FOUND_ERROR);
});

test('should call bcrypt compare', async () => {
  const password = faker.internet.password(8);

  const user = {
    email: faker.internet.email(),
    password,
  };

  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const passwordMock = jest.fn(() => true);
  bcrypt.compare.mockImplementationOnce(passwordMock);

  const args = { input: { password } };
  await login(null, args);

  expect(passwordMock).toHaveBeenCalledWith(password, password);
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
});

test('should generate tokens and set refresh cookie', async () => {
  // FindOne Mock
  const foundUser = 'foundUser';
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => foundUser,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  bcrypt.compare.mockImplementationOnce(() => true);

  const jwtTokenMock = jest.fn();
  generateJwtToken.mockImplementationOnce(jwtTokenMock);

  const refreshToken = { token: FakeToken() };
  const refreshTokenMock = jest.fn(() => refreshToken);
  generateRefreshToken.mockImplementationOnce(refreshTokenMock);

  const setTokenMock = jest.fn();
  setTokenCookie.mockImplementationOnce(setTokenMock);

  const ctx = { req: { ip: faker.internet.ip() }, res: {} };
  await login(null, null, ctx, null);

  expect(jwtTokenMock).toHaveBeenCalledWith(foundUser);
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
  generateJwtToken.mockImplementationOnce(() => token);

  const result = await login();

  expect(result.token).toBe(token);
});
