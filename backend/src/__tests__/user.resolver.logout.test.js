import { logout } from '#graphql/user/resolvers/logout';
import { FakeObjectId } from '#utils/fixtures';

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
