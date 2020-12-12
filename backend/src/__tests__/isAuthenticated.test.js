import { isAuthenticated } from '../utils/isAuthenticated';
import { AUTH_LOGGED_OUT_ERROR } from '../utconfigils/constants';
import { FakeObjectId } from '../utils/fixtures';

test('should throw error when not logged in', () => {
  expect(() => isAuthenticated()).toThrow(AUTH_LOGGED_OUT_ERROR);
});

test('should not throw error when logged in', () => {
  const ctx = { userId: FakeObjectId() };

  expect(() => isAuthenticated(ctx)).not.toThrow();
});
