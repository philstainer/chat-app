import { logout } from '#graphql/user/resolvers/logout';
import { isAuthenticated } from '#utils/isAuthenticated';
import { FakeObjectId } from '#utils/fixtures';

jest.mock('#utils/isAuthenticated.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const ctx = {
    userId: FakeObjectId(),
    res: { clearCookie: jest.fn() },
  };

  await logout(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should clear token cookie', async () => {
  const ctx = {
    userId: FakeObjectId(),
    res: { clearCookie: jest.fn() },
  };

  await logout(null, null, ctx, null);

  expect(ctx.res.clearCookie).toHaveBeenCalledWith('token');
});

test('should return true on success', async () => {
  const ctx = {
    userId: FakeObjectId(),
    res: { clearCookie: jest.fn() },
  };

  const returnValue = await logout(null, null, ctx, null);

  expect(returnValue).toBe(true);
});
