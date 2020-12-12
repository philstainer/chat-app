import faker from 'faker';

import { me } from '#graphql/user/resolvers/me';
import { User } from '#graphql/user/user.model';
import { selectedFields } from '#utils/selectedFields';
import { FakeObjectId } from '#utils/fixtures';

jest.mock('#utils/selectedFields.js');
jest.mock('#graphql/user/user.model.js');

test('should return null when not logged in', async () => {
  const result = await me(null, null, null, null);

  expect(result).toBeNull();
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

  const ctx = { userId: FakeObjectId() };
  const info = { name: null };
  await me(null, null, ctx, info);

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

  const ctx = { userId: FakeObjectId() };
  await me(null, null, ctx, null);

  expect(userMock.findById).toHaveBeenCalledWith(ctx.userId);
  expect(userMock.select).toHaveBeenCalledWith(selected);
  expect(userMock.lean).toHaveBeenCalled();
});

test('should return user', async () => {
  const user = {
    _id: FakeObjectId(),
    email: faker.internet.email(),
  };

  const userMock = {
    findById: () => userMock,
    select: () => userMock,
    lean: () => user,
  };
  User.findById.mockImplementation(userMock.findById);

  const ctx = { userId: FakeObjectId() };
  const returnedUser = await me(null, null, ctx, null);

  expect(returnedUser).toEqual(user);
});
