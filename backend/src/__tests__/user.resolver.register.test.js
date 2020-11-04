import faker from 'faker';

import { userResolver } from '../graphql/user/user.resolver';
import { userController } from '../graphql/user/user.controller';
import { generateCookie } from '../utils/generateCookie';
import { isNotAuthenticated } from '../utils/isNotAuthenticated';

const { register } = userResolver.Mutation;

jest.mock('../graphql/user/user.controller.js');
jest.mock('../utils/generateCookie.js');
jest.mock('../utils/logger.js');
jest.mock('../utils/isNotAuthenticated.js');

test('should check auth', async () => {
  const authMock = jest.fn();
  isNotAuthenticated.mockImplementation(authMock);

  userController.createUser.mockImplementation(() => ({ _id: 123 }));

  const ctx = { req: {} };
  await register(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should create user', async () => {
  const args = { input: { email: faker.internet.email() } };
  const ctx = { req: {} };

  const createUserMock = jest.fn(() => ({ _id: 123 }));
  userController.createUser.mockImplementation(createUserMock);

  await register(null, args, ctx, null);

  expect(createUserMock).toHaveBeenCalledWith(args);
});

test('should create cookie', async () => {
  const createdUser = { _id: 123, email: faker.internet.email() };
  userController.createUser.mockImplementation(() =>
    Promise.resolve(createdUser)
  );

  const cookieMock = jest.fn();
  generateCookie.mockImplementation(cookieMock);

  await register(null, { input: {} }, null, null);

  expect(cookieMock).toHaveBeenCalledWith(
    { sub: createdUser._id },
    'token',
    null
  );
});

test('should return created user', async () => {
  const createdUser = { _id: 123, email: faker.internet.email() };
  userController.createUser.mockImplementation(() =>
    Promise.resolve(createdUser)
  );

  const returnedUser = await register(null, { input: {} }, null, null);

  expect(returnedUser).toEqual(createdUser);
});
