import faker from 'faker';
import bcrypt from 'bcryptjs';

import { userResolver } from '../graphql/user/user.resolver';
import { User } from '../graphql/user/user.modal';
import { AUTH_LOGGED_IN_ERROR, INVALID_TOKEN_ERROR } from '../utils/constants';
import { accessEnv } from '../utils/accessEnv';
import { selectedFields } from '../utils/selectedFields';
import { generateCookie } from '../utils/generateCookie';

const { resetPassword } = userResolver.Mutation;

jest.mock('../graphql/user/user.modal.js');
jest.mock('../utils/generateCookie.js');
jest.mock('../utils/logger.js');
jest.mock('../utils/accessEnv');
jest.mock('../utils/selectedFields');
jest.mock('bcryptjs');

test('should throw error when logged in', async () => {
  const ctx = { req: { userId: 12345 } };

  await expect(() => resetPassword(null, null, ctx, null)).rejects.toThrow(
    AUTH_LOGGED_IN_ERROR
  );
});

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
    _id: faker.random.uuid(),
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

test('should generate user cookie', async () => {
  // FindOne Mock
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // FindByIdAndUpdate Mock
  const updatedUser = {
    _id: faker.random.uuid(),
  };

  const updateMock = {
    findByIdAndUpdate: () => updateMock,
    select: () => updateMock,
    lean: () => updatedUser,
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const generateCookieMock = jest.fn();
  generateCookie.mockImplementationOnce(generateCookieMock);

  const ctx = {};
  await resetPassword(null, null, ctx, null);

  expect(generateCookieMock).toHaveBeenCalledWith(
    { sub: updatedUser._id },
    'token',
    ctx
  );
});

test('should return user', async () => {
  // FindOne Mock
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // FindByIdAndUpdate Mock
  const updatedUser = {
    _id: faker.random.uuid(),
  };

  const updateMock = {
    findByIdAndUpdate: () => updateMock,
    select: () => updateMock,
    lean: () => updatedUser,
  };
  User.findByIdAndUpdate.mockImplementationOnce(updateMock.findByIdAndUpdate);

  const result = await resetPassword(null, null, null, null);

  expect(result).toBe(updatedUser);
});
