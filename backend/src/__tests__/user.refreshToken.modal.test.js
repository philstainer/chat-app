import ms from 'ms';

import { RefreshToken } from '../graphql/user/refreshToken.model';
import { FakeObjectId } from '../utils/fixtures';

test('should have isExpired virtual property', async () => {
  const refreshToken = new RefreshToken({
    expires: Date.now() + ms('-5m'),
  });

  expect(refreshToken.isExpired).toBe(true);
});

test('should have isActive virtual property', async () => {
  const refreshToken = new RefreshToken({
    expires: Date.now() + ms('5m'),
  });

  expect(refreshToken.isActive).toBe(true);
});

test('should remove unnecessary properties when toJSON', async () => {
  const refreshToken = new RefreshToken({
    expires: Date.now() + ms('5m'),
    user: FakeObjectId(),
  });

  const json = refreshToken.toJSON();

  expect(json).not.toHaveProperty('_id');
  expect(json).not.toHaveProperty('id');
  expect(json).not.toHaveProperty('user');
});
