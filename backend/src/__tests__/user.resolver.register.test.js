import faker from 'faker';
import sgMail from '@sendgrid/mail';

import { userResolver } from '../graphql/user/user.resolver';
import { userController } from '../graphql/user/user.controller';
import { generateCookie } from '../utils/generateCookie';
import { isNotAuthenticated } from '../utils/isNotAuthenticated';
import { accessEnv } from '../utils/accessEnv';
import { FakeObjectId } from '../utils/fixtures';

const { register } = userResolver.Mutation;

jest.mock('../graphql/user/user.controller.js');
jest.mock('../utils/generateCookie.js');
jest.mock('../utils/logger.js');
jest.mock('../utils/isNotAuthenticated.js');
jest.mock('../utils/accessEnv');
jest.mock('@sendgrid/mail');

test('should check auth', async () => {
  const authMock = jest.fn();
  isNotAuthenticated.mockImplementation(authMock);

  userController.createUser.mockImplementation(() => ({ _id: FakeObjectId() }));

  const ctx = { req: { get: () => {} } };
  await register(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should create user', async () => {
  const args = { input: { email: faker.internet.email() } };
  const ctx = { req: { get: () => {} } };

  const createUserMock = jest.fn(() => ({ _id: FakeObjectId() }));
  userController.createUser.mockImplementation(createUserMock);

  await register(null, args, ctx, null);

  expect(createUserMock).toHaveBeenCalledWith(args);
});

test('should create cookie', async () => {
  const ctx = { req: { get: () => {} } };

  const createdUser = { _id: FakeObjectId(), email: faker.internet.email() };
  userController.createUser.mockImplementation(() =>
    Promise.resolve(createdUser)
  );

  const cookieMock = jest.fn();
  generateCookie.mockImplementation(cookieMock);

  await register(null, { input: {} }, ctx, null);

  expect(cookieMock).toHaveBeenCalledWith(
    { sub: createdUser._id },
    'token',
    ctx
  );
});

test('should send confirm email', async () => {
  const ctx = { req: { get: () => {} } };

  const createdUser = {
    _id: FakeObjectId(),
    email: faker.internet.email(),
    verifyToken: faker.random.uuid(),
  };
  userController.createUser.mockImplementation(() =>
    Promise.resolve(createdUser)
  );

  const from = faker.internet.email();
  accessEnv.mockImplementationOnce(() => from);

  const sendEmailMock = jest.fn();
  sgMail.send.mockImplementationOnce(sendEmailMock);

  await register(null, { input: {} }, ctx, null);

  expect(sendEmailMock).toHaveBeenCalledWith(
    expect.objectContaining({
      from,
      to: createdUser.email,
    })
  );
});

test('should return created user', async () => {
  const ctx = { req: { get: () => {} } };

  const createdUser = { _id: FakeObjectId(), email: faker.internet.email() };
  userController.createUser.mockImplementation(() =>
    Promise.resolve(createdUser)
  );

  const returnedUser = await register(null, { input: {} }, ctx, null);

  expect(returnedUser).toEqual(createdUser);
});
