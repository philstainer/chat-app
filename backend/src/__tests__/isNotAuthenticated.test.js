import { isNotAuthenticated } from '../utils/isNotAuthenticated';

test('should throw error when logged in', () => {
  const ctx = { res: { userId: 12345 } };

  expect(() => isNotAuthenticated(ctx)).toThrow('You are already logged in');
});

test('should not throw error when not logged in', () => {
  expect(() => isNotAuthenticated()).not.toThrow();
});
