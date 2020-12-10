import faker from 'faker';
import sgMail from '@sendgrid/mail';

import { userResolver } from '../graphql/user/user.resolver';
import { User } from '../graphql/user/user.model';
import { AUTH_LOGGED_IN_ERROR } from '../utils/constants';
import { accessEnv } from '../utils/accessEnv';
import { generateToken } from '../utils/generateToken';
import { FakeObjectId } from '../utils/fixtures';

const { resetPasswordRequest } = userResolver.Mutation;

jest.mock('../graphql/user/user.model.js');
jest.mock('../utils/generateToken.js');
jest.mock('../utils/logger.js');
jest.mock('../utils/accessEnv');
jest.mock('@sendgrid/mail');

test('should throw error when logged in', async () => {
  const ctx = { req: { userId: FakeObjectId() } };

  await expect(() =>
    resetPasswordRequest(null, null, ctx, null)
  ).rejects.toThrow(AUTH_LOGGED_IN_ERROR);
});

test('should find user via email', async () => {
  // FindOne Mock
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => 'user'),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const args = {
    input: {
      email: faker.internet.email(),
    },
  };
  await resetPasswordRequest(null, args, null, null);

  expect(userMock.findOne).toHaveBeenCalledWith(
    expect.objectContaining({ email: args.input.email })
  );
});

test('should generate reset token with expiry and send reset email', async () => {
  const user = { _id: FakeObjectId() };

  // FindOne Mock
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => user),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // FindByIdAndUpdate Mock
  const updateMock = jest.fn(() => null);
  User.findByIdAndUpdate.mockImplementationOnce(updateMock);

  // Reset Token
  const resetToken = 'token';
  generateToken.mockImplementationOnce(() => Promise.resolve(resetToken));

  // Email mock
  const sendEmailMock = jest.fn();
  sgMail.send.mockImplementationOnce(sendEmailMock);

  // Mock from
  const from = faker.internet.email();
  accessEnv
    .mockImplementationOnce(() => 'url')
    .mockImplementationOnce(() => from);

  const args = { input: { email: faker.internet.email() } };
  await resetPasswordRequest(null, args, null, null);

  expect(updateMock).toHaveBeenCalledWith(
    user._id,
    expect.objectContaining({ resetToken })
  );
  expect(sendEmailMock).toHaveBeenCalledWith(
    expect.objectContaining({
      from,
      to: args.input.email,
    })
  );
});

test('should return true on success', async () => {
  // FindOne Mock
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => null),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  const result = await resetPasswordRequest();

  expect(result).toBe(true);
});
