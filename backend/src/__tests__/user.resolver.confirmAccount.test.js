import faker from 'faker';

import { userResolver } from '../graphql/user/user.resolver';
import { User } from '../graphql/user/user.modal';
import { USER_CONFIRM_ACCOUNT_ERROR } from '../utils/constants';

const { confirmAccount } = userResolver.Mutation;

jest.mock('../graphql/user/user.modal.js');

test('should find user via token and expiry', async () => {
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const args = {
    input: {
      token: faker.random.uuid(),
    },
  };
  await confirmAccount(null, args, null, null);

  expect(userMock.findOne).toHaveBeenCalledWith(
    expect.objectContaining({ verifyToken: args.input.token })
  );
});

test('should throw error when user not found', async () => {
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => null),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  await expect(() => confirmAccount()).rejects.toThrow(
    USER_CONFIRM_ACCOUNT_ERROR
  );
});

test('should set user to be verified, remove token and expiry', async () => {
  const user = { _id: faker.random.uuid() };

  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => user),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const updateMock = jest.fn(() => null);
  User.findByIdAndUpdate.mockImplementationOnce(updateMock);

  await confirmAccount();

  expect(updateMock).toHaveBeenCalledWith(user._id, {
    verified: true,
    verifyToken: null,
    verifyTokenExpiry: null,
  });
});

test('should return true on success', async () => {
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const updateMock = jest.fn(() => null);
  User.findByIdAndUpdate.mockImplementationOnce(updateMock);

  const result = await confirmAccount();

  expect(result).toBe(true);
});
