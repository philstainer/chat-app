import faker from 'faker';

import { RefreshToken } from '#graphql/user/refreshToken.model';
import { FakeUser } from '#utils/fixtures';
import { generateRefreshToken } from '#utils/generateRefreshToken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('#graphql/user/refreshToken.model.js');

test('should create and return new refresh token', async () => {
  const user = FakeUser();
  const ipAddress = faker.internet.ip();

  const createdRefreshToken = { _id: faker.random.uuid() };
  const createMock = jest.fn(() => createdRefreshToken);
  RefreshToken.create.mockImplementationOnce(createMock);

  const refreshToken = await generateRefreshToken(user, ipAddress);

  expect(createMock).toHaveBeenCalledWith(
    expect.objectContaining({ createdByIp: ipAddress, user: user._id })
  );
  expect(refreshToken).toBe(createdRefreshToken);
});
