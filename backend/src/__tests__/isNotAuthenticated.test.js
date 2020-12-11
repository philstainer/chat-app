import { isNotAuthenticated } from '../utils/isNotAuthenticated';
import { AUTH_LOGGED_IN_ERROR } from '../utils/constants';
import { FakeObjectId } from '../utils/fixtures';

test('should throw error when logged in', () => {
  const ctx = { userId: FakeObjectId() };

  expect(() => isNotAuthenticated(ctx)).toThrow(AUTH_LOGGED_IN_ERROR);
});

test('should not throw error when not logged in', () => {
  expect(() => isNotAuthenticated()).not.toThrow();
});
