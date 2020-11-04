import { isAuthenticated } from '../utils/isAuthenticated';
import { AUTH_LOGGED_OUT_ERROR } from '../utils/constants';

test('should throw error when not logged in', () => {
  expect(() => isAuthenticated()).toThrow(AUTH_LOGGED_OUT_ERROR);
});

test('should not throw error when logged in', () => {
  const ctx = { req: { userId: 12345 } };

  expect(() => isAuthenticated(ctx)).not.toThrow();
});
