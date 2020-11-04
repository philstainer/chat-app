import { isNotAuthenticated } from '../utils/isNotAuthenticated';
import { AUTH_LOGGED_IN_ERROR } from '../utils/constants';

test('should throw error when logged in', () => {
  const ctx = { req: { userId: 12345 } };

  expect(() => isNotAuthenticated(ctx)).toThrow(AUTH_LOGGED_IN_ERROR);
});

test('should not throw error when not logged in', () => {
  expect(() => isNotAuthenticated()).not.toThrow();
});
