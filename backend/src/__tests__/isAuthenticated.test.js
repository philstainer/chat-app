import { isAuthenticated } from '../utils/isAuthenticated';

test('should throw error when not logged in', () => {
  expect(() => isAuthenticated()).toThrow('You must be logged in to do that');
});

test('should not throw error when logged in', () => {
  const ctx = { res: { userId: 12345 } };

  expect(() => isAuthenticated(ctx)).not.toThrow();
});
