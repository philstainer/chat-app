import faker from 'faker';

import { resetPasswordRequest } from '#graphql/user/resolvers/resetPasswordRequest';
import { User } from '#graphql/user/user.model';
import { accessEnv } from '#utils/accessEnv';
import { FakeUser } from '#utils/fixtures';
import { randomTokenString } from '#utils/helpers';
import { resetPasswordEmail } from '#utils/notifications';

jest.mock('#utils/notifications.js', () => ({
  resetPasswordEmail: jest.fn(),
}));
jest.mock('#utils/helpers.js');
jest.mock('#graphql/user/user.model.js');
jest.mock('#utils/logger.js');
jest.mock('#utils/accessEnv');

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
  const user = FakeUser();

  // FindOne Mock
  const userMock = {
    findOne: jest.fn(() => userMock),
    select: jest.fn(() => userMock),
    lean: jest.fn(() => user),
  };
  User.findOne.mockImplementationOnce(userMock.findOne);

  // FindByIdAndUpdate Mock
  User.findByIdAndUpdate.mockImplementationOnce(() => {});

  // Reset Token
  const resetToken = 'token';
  randomTokenString.mockImplementationOnce(() => resetToken);

  // Email mock
  const emailMock = jest.fn();
  resetPasswordEmail.mockImplementationOnce(emailMock);

  // Mock from
  const from = faker.internet.email();
  accessEnv
    .mockImplementationOnce(() => 'url')
    .mockImplementationOnce(() => from);

  const args = { input: { email: faker.internet.email() } };
  await resetPasswordRequest(null, args, null, null);

  expect(emailMock).toHaveBeenCalledWith(user.email, resetToken, user.username);
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
