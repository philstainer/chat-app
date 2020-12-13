import faker from 'faker';
import bcrypt from 'bcryptjs';

import { register } from '#graphql/user/resolvers/register';
import { User } from '#graphql/user/user.model';
import { accessEnv } from '#utils/accessEnv';
import { FakeObjectId, FakeToken, FakeUser } from '#utils/fixtures';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
  randomTokenString,
} from '#utils/helpers';
import { registrationEmail } from '#utils/notifications';
import { REFRESH_TOKEN } from '#config/constants';

jest.mock('#utils/notifications.js', () => ({
  registrationEmail: jest.fn(),
}));
jest.mock('#utils/helpers.js');
jest.mock('#utils/logger.js');
jest.mock('#utils/accessEnv');
jest.mock('#graphql/user/user.model.js');
jest.mock('bcryptjs');

test('should create user with hashedPassword and verify token', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  const hashedPassword = faker.internet.password(8);
  bcrypt.hash.mockImplementationOnce(() => hashedPassword);

  const verifyToken = faker.random.uuid();
  randomTokenString.mockImplementationOnce(() => verifyToken);

  const createUserMock = jest.fn();
  User.create.mockImplementationOnce(createUserMock);

  const args = { input: { email: faker.internet.email() } };
  await register(null, args, null, null);

  expect(createUserMock).toHaveBeenCalledWith({
    ...args.input,
    password: hashedPassword,
    verifyToken,
  });
});

test('should generate tokens and set refresh cookie', async () => {
  const createdUser = 'createdUser';

  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  User.create.mockImplementationOnce(() => createdUser);

  const jwtTokenMock = jest.fn();
  generateJwtToken.mockImplementationOnce(jwtTokenMock);

  const refreshToken = { token: FakeToken() };
  const refreshTokenMock = jest.fn(() => refreshToken);
  generateRefreshToken.mockImplementationOnce(refreshTokenMock);

  const setTokenMock = jest.fn();
  setTokenCookie.mockImplementationOnce(setTokenMock);

  const ctx = { req: { ip: faker.internet.ip() } };
  await register(null, null, ctx, null);

  expect(jwtTokenMock).toHaveBeenCalledWith(createdUser);
  expect(refreshTokenMock).toHaveBeenCalledWith('createdUser', ctx.req.ip);
  expect(setTokenMock).toHaveBeenCalledWith(
    REFRESH_TOKEN,
    refreshToken.token,
    ctx.res
  );
});

test('should send confirmation email', async () => {
  const createdUser = FakeUser();
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  const verifyToken = faker.random.uuid();
  randomTokenString.mockImplementationOnce(() => verifyToken);

  User.create.mockImplementationOnce(() => createdUser);

  const from = faker.internet.email();
  accessEnv
    .mockImplementationOnce(() => 'url')
    .mockImplementationOnce(() => from);

  const emailMock = jest.fn();
  registrationEmail.mockImplementationOnce(emailMock);

  await register(null, { input: {} }, null, null);

  expect(emailMock).toHaveBeenCalledWith(
    createdUser.email,
    verifyToken,
    createdUser.username
  );
});

test('should return token', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  User.create.mockImplementationOnce(() => {});

  const token = FakeToken();
  generateJwtToken.mockImplementationOnce(() => token);

  const result = await register(null, null, null, null);

  expect(result.token).toEqual(token);
});
