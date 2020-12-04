import faker from 'faker';
import bcrypt from 'bcryptjs';
import { userResolver } from '../graphql/user/user.resolver';
import { User } from '../graphql/user/user.modal';
import { selectedFields } from '../utils/selectedFields';
import { generateCookie } from '../utils/generateCookie';
import { isNotAuthenticated } from '../utils/isNotAuthenticated';
import { USER_NOT_FOUND_ERROR } from '../utils/constants';
import { FakeObjectId } from '../utils/fixtures';

const { login } = userResolver.Mutation;

jest.mock('../utils/isNotAuthenticated.js');
jest.mock('../utils/selectedFields.js');
jest.mock('../utils/generateCookie.js');
jest.mock('../graphql/user/user.modal.js');
jest.mock('bcryptjs');

test('should call isNotAuthenticated', async () => {
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementation(userMock.findOne);
  bcrypt.compare.mockImplementation(() => true);

  const ctx = { req: { userId: FakeObjectId() } };

  await login(null, null, ctx, null);

  expect(isNotAuthenticated).toHaveBeenCalledWith(ctx);
});

test('should call selectFields', async () => {
  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => 'user',
  };
  User.findOne.mockImplementation(userMock.findOne);

  const fieldsMock = jest.fn();
  selectedFields.mockImplementation(fieldsMock);

  const info = { name: 1 };
  await login(null, null, null, info);

  expect(fieldsMock).toHaveBeenCalledWith(info);
});

test('should get user via email', async () => {
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findOne.mockImplementation(userMock.findOne);

  const selected = '_id name';
  selectedFields.mockImplementation(() => selected);

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
  User.findOne.mockImplementation(userMock.findOne);

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
  User.findOne.mockImplementation(userMock.findOne);

  const passwordMock = jest.fn(() => true);
  bcrypt.compare.mockImplementation(passwordMock);

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
  User.findOne.mockImplementation(userMock.findOne);

  const passwordMock = jest.fn(() => false);
  bcrypt.compare.mockImplementation(passwordMock);

  await expect(() => login()).rejects.toThrow(USER_NOT_FOUND_ERROR);
});

test('should call generateCookie', async () => {
  const user = {
    _id: FakeObjectId(),
    email: faker.internet.email(),
  };

  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findOne.mockImplementation(userMock.findOne);

  const cookieMock = jest.fn();
  generateCookie.mockImplementation(cookieMock);

  bcrypt.compare.mockImplementation(() => true);

  const ctx = { req: {} };

  await login(null, null, ctx, null);

  expect(cookieMock).toHaveBeenCalledWith({ sub: user._id }, 'token', ctx);
});
test('should return found user', async () => {
  const user = {
    _id: FakeObjectId(),
    email: faker.internet.email(),
  };

  const userMock = {
    findOne: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findOne.mockImplementation(userMock.findOne);

  const returnedUser = await login();

  expect(returnedUser).toEqual(user);
});
