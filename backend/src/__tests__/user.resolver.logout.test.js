import { userResolver } from '../graphql/user/user.resolver';
import { isAuthenticated } from '../utils/isAuthenticated';
import { FakeObjectId } from '../utils/fixtures';

const { logout } = userResolver.Mutation;

jest.mock('../utils/isAuthenticated.js');

test('should call isAuthenticated', () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementation(authMock);

  const ctx = {
    userId: FakeObjectId(),
    res: { clearCookie: jest.fn() },
  };

  logout(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should clear token cookie', () => {
  const ctx = {
    userId: FakeObjectId(),
    res: { clearCookie: jest.fn() },
  };

  logout(null, null, ctx, null);

  expect(ctx.res.clearCookie).toHaveBeenCalledWith('token');
});

test('should return true on success', () => {
  const ctx = {
    userId: FakeObjectId(),
    res: { clearCookie: jest.fn() },
  };

  const returnValue = logout(null, null, ctx, null);

  expect(returnValue).toEqual(true);
});
