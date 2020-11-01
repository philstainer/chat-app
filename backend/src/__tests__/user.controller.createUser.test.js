import bcrypt from 'bcryptjs';
import faker from 'faker';

import { userController, expiresAt } from '../graphql/user/user.controller';

import { User } from '../graphql/user/user.modal';
import { generateToken } from '../utils/generateToken';

jest.mock('bcryptjs');
jest.mock('../utils/generateToken.js');
jest.mock('../graphql/user/user.modal.js');

test('should throw error when email is already registered', async () => {
  const checkUserMock = {
    select: jest.fn(() => checkUserMock),
    lean: jest.fn(() => ({ email: faker.internet.email() })),
  };

  User.findOne.mockImplementation(() => checkUserMock);

  const args = {
    password: faker.internet.password(8),
    email: faker.internet.email(),
  };

  await expect(() => userController.createUser(args)).rejects.toThrow(
    'Email already registered'
  );
});

test('should hash password', async () => {
  const checkUserMock = {
    select: jest.fn(() => checkUserMock),
    lean: jest.fn(() => null),
  };

  User.findOne.mockImplementation(() => checkUserMock);

  const hashMock = jest.fn();
  bcrypt.hash.mockImplementation(hashMock);

  const password = faker.internet.password(8);
  await userController.createUser({ password });

  expect(hashMock).toHaveBeenCalledWith(password, 10);
});

test('should generate verify random token', async () => {
  const checkUserMock = {
    select: jest.fn(() => checkUserMock),
    lean: jest.fn(() => null),
  };

  User.findOne.mockImplementation(() => checkUserMock);

  const tokenMock = jest.fn();
  generateToken.mockImplementation(tokenMock);

  const password = faker.internet.password(8);
  await userController.createUser({ password });

  expect(tokenMock).toHaveBeenCalledTimes(1);
});

test('should create user with args and hashed password', async () => {
  const checkUserMock = {
    select: jest.fn(() => checkUserMock),
    lean: jest.fn(() => null),
  };

  User.findOne.mockImplementation(() => checkUserMock);

  const hashedPassword = 'hashed password';
  bcrypt.hash.mockImplementation(() => Promise.resolve(hashedPassword));

  const userMock = jest.fn();
  User.create.mockImplementation(userMock);

  const args = {
    password: faker.internet.password(8),
    email: faker.internet.email(),
  };
  await userController.createUser(args);

  const expected = {
    ...args,
    password: hashedPassword,
  };

  expect(userMock).toHaveBeenCalledWith(expect.objectContaining(expected));
});

test('should create user with verify token and expiry', async () => {
  const checkUserMock = {
    select: jest.fn(() => checkUserMock),
    lean: jest.fn(() => null),
  };

  User.findOne.mockImplementation(() => checkUserMock);

  const hashedPassword = 'hashed password';
  bcrypt.hash.mockImplementation(() => Promise.resolve(hashedPassword));

  const verifyToken = 'token';
  generateToken.mockImplementation(() => Promise.resolve(verifyToken));

  const userMock = jest.fn();
  User.create.mockImplementation(userMock);

  const args = {
    password: faker.internet.password(8),
  };

  const date = Date.now();
  jest.spyOn(global.Date, 'now').mockImplementationOnce(() => date);

  await userController.createUser(args);

  const expected = {
    ...args,
    password: hashedPassword,
    verifyToken,
    verifyTokenExpiry: expiresAt,
  };
  expect(userMock).toHaveBeenCalledWith(expected);
});

test('should return created user', async () => {
  const checkUserMock = {
    select: jest.fn(() => checkUserMock),
    lean: jest.fn(() => null),
  };

  User.findOne.mockImplementation(() => checkUserMock);

  const args = {
    password: faker.internet.password(8),
  };

  User.create.mockImplementation(() => Promise.resolve(args));

  const createdUser = await userController.createUser(args);

  expect(createdUser).toEqual(args);
});
