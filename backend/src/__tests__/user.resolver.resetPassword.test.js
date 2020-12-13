import faker from 'faker';
import bcrypt from 'bcryptjs';

import { resetPassword } from '#graphql/user/resolvers/resetPassword';
import { User } from '#graphql/user/user.model';
import { INVALID_TOKEN_ERROR, REFRESH_TOKEN } from '#config/constants';
import { selectedFields } from '#utils/selectedFields';
import {
  generateJwtToken,
  generateRefreshToken,
  setTokenCookie,
} from '#utils/helpers';

import { FakeObjectId, FakeToken } from '#utils/fixtures';

jest.mock('#graphql/user/user.model.js');
jest.mock('#utils/logger.js');
jest.mock('#utils/accessEnv');
jest.mock('#utils/selectedFields');
jest.mock('#utils/helpers.js');
jest.mock('bcryptjs');

test('should find user via resetToken', async () => {
  // FindOne Mock
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // FindByIdAndUpdate Mock
  const updateMock = {
    findByIdAndUpdate: () => updateMock,
    select: () => updateMock,
    lean: () => null,
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const args = {
    input: {
      token: faker.random.uuid(),
    },
  };
  await resetPassword(null, args, null, null);

  expect(userMock.findOne).toHaveBeenCalledWith(
    expect.objectContaining({ resetToken: args.input.token })
  );
});

test('should throw error when user not found', async () => {
  // FindOne Mock
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => null),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  await expect(() => resetPassword()).rejects.toThrow(INVALID_TOKEN_ERROR);
});

test('should generate select fields', async () => {
  // FindOne Mock
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // Selected Fields Mock
  const fieldsMock = jest.fn();
  selectedFields.mockImplementationOnce(fieldsMock);

  // FindByIdAndUpdate Mock
  const updateMock = {
    findByIdAndUpdate: () => updateMock,
    select: () => updateMock,
    lean: () => null,
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const info = { name: 1 };
  await resetPassword(null, null, null, info);

  expect(fieldsMock).toHaveBeenCalledWith(info);
});

test('should update user with new password', async () => {
  const user = {
    _id: FakeObjectId(),
  };

  // FindOne Mock
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // Hash Password Mock
  const hashedPassword = faker.internet.password(8);
  const hashMock = jest.fn(() => Promise.resolve(hashedPassword));
  bcrypt.hash.mockImplementation(hashMock);

  // FindByIdAndUpdate Mock
  const updateMock = {
    findByIdAndUpdate: jest.fn(() => updateMock),
    select: () => updateMock,
    lean: () => null,
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const args = {
    input: {
      token: faker.random.uuid(),
      password: faker.internet.password(8),
    },
  };
  await resetPassword(null, args, null, null);

  expect(hashMock).toHaveBeenCalled();
  expect(updateMock.findByIdAndUpdate).toHaveBeenCalledWith(
    user._id,
    {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
    { new: true }
  );
});

test('should generate tokens and set refresh cookie', async () => {
  // FindOne Mock
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // FindByIdAndUpdate Mock
  const updatedUser = 'updatedUser';
  const updateMock = {
    findByIdAndUpdate: () => updateMock,
    select: () => updateMock,
    lean: () => updatedUser,
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const jwtTokenMock = jest.fn();
  generateJwtToken.mockImplementationOnce(jwtTokenMock);

  const refreshToken = { token: faker.random.uuid() };
  const refreshTokenMock = jest.fn(() => refreshToken);
  generateRefreshToken.mockImplementationOnce(refreshTokenMock);

  const setTokenMock = jest.fn();
  setTokenCookie.mockImplementationOnce(setTokenMock);

  const ctx = { req: { ip: faker.internet.ip() }, res: {} };
  await resetPassword(null, null, ctx, null);

  expect(jwtTokenMock).toHaveBeenCalledWith(updatedUser);
  expect(refreshTokenMock).toHaveBeenCalledWith(updatedUser, ctx.req.ip);
  expect(setTokenMock).toHaveBeenCalledWith(
    REFRESH_TOKEN,
    refreshToken.token,
    ctx.res
  );
});

test('should return token', async () => {
  // FindOne Mock
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const token = FakeToken();
  generateJwtToken.mockImplementationOnce(() => token);

  const updateMock = {
    findByIdAndUpdate: () => updateMock,
    select: () => updateMock,
    lean: () => 'updatedUser',
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const result = await resetPassword(null, null, null, null);

  expect(result.token).toBe(token);
});
