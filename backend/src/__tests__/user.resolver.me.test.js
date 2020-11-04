import faker from 'faker';

import { userResolver } from '../graphql/user/user.resolver';
import { User } from '../graphql/user/user.modal';
import { isAuthenticated } from '../utils/isAuthenticated';
import { selectedFields } from '../utils/selectedFields';
import { USER_NOT_FOUND_ERROR } from '../utils/constants';

const { me } = userResolver.Query;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../utils/selectedFields.js');
jest.mock('../graphql/user/user.modal.js');

test('should call isAuthenticated', async () => {
  const userMock = {
    findById: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findById.mockImplementation(userMock.findById);

  const authMock = jest.fn();
  isAuthenticated.mockImplementation(authMock);

  const ctx = { req: { userId: 12345 } };

  await me(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should call selectedFields', async () => {
  const userMock = {
    findById: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findById.mockImplementation(userMock.findById);

  const selectMock = jest.fn();
  selectedFields.mockImplementation(selectMock);

  const info = { name: null };
  await me(null, null, null, info);

  expect(selectMock).toHaveBeenCalledWith(info);
});

test('should get user via userId from req on ctx', async () => {
  const userMock = {
    findById: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findById.mockImplementation(userMock.findById);

  const selected = '_id name';
  selectedFields.mockImplementation(() => selected);

  const ctx = { req: { userId: 12345 } };

  await me(null, null, ctx, null);

  expect(userMock.findById).toHaveBeenCalledWith(ctx.req.userId);
  expect(userMock.select).toHaveBeenCalledWith(selected);
  expect(userMock.lean).toHaveBeenCalled();
});

test('should throw error when user not found', async () => {
  const userMock = {
    findById: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => null),
  };
  User.findById.mockImplementation(userMock.findById);

  await expect(() => me()).rejects.toThrow(USER_NOT_FOUND_ERROR);
});

test('should return user', async () => {
  const user = {
    _id: 12345,
    email: faker.internet.email(),
  };

  const userMock = {
    findById: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findById.mockImplementation(userMock.findById);

  const returnedUser = await me();

  expect(returnedUser).toEqual(user);
});
