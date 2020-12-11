import faker from 'faker';
import sgMail from '@sendgrid/mail';

import { userResolver } from '../graphql/user/user.resolver';
import { isNotAuthenticated } from '../utils/isNotAuthenticated';
import { User } from '../graphql/user/user.model';
import { accessEnv } from '../utils/accessEnv';
import { FakeObjectId, FakeToken, FakeUser } from '../utils/fixtures';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
  hashPassword,
  randomTokenString,
} from '../utils/helpers';
import { USER_FOUND_ERROR, REFRESH_TOKEN } from '../utils/constants';

const { register } = userResolver.Mutation;

jest.mock('../utils/isNotAuthenticated.js');
jest.mock('../utils/helpers.js');
jest.mock('../utils/logger.js');
jest.mock('../utils/accessEnv');
jest.mock('../graphql/user/user.model.js');
jest.mock('@sendgrid/mail');

test('should call isNotAuthenticated', async () => {
  const authMock = jest.fn();
  isNotAuthenticated.mockImplementationOnce(authMock);

  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  const ctx = { userId: FakeObjectId() };

  await register(null, null, ctx, null);

  expect(authMock).toHaveBeenCalled();
});

test('should check if user email exists', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  await register(null, null, null, null);

  expect(findOneMock.findOne).toHaveBeenCalled();
});

test('should throw error when user exists', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  await expect(() => register(null, null, null, null)).rejects.toThrow(
    USER_FOUND_ERROR
  );
});

test('should create user with hashedPassword and verify token', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  User.findOne.mockImplementationOnce(findOneMock.findOne);

  const hashedPassword = faker.internet.password(8);
  hashPassword.mockImplementationOnce(() => hashedPassword);

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

  User.create.mockImplementationOnce(() => createdUser);

  const from = faker.internet.email();
  accessEnv
    .mockImplementationOnce(() => 'url')
    .mockImplementationOnce(() => from);

  const sendEmailMock = jest.fn();
  sgMail.send.mockImplementationOnce(sendEmailMock);

  await register(null, { input: {} }, null, null);

  expect(sendEmailMock).toHaveBeenCalledWith(
    expect.objectContaining({
      from,
      to: createdUser.email,
    })
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
