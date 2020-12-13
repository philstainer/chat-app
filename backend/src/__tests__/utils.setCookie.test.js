import { setCookie } from '#utils/setCookie';
import { accessEnv } from '#utils/accessEnv';

jest.mock('#utils/accessEnv.js');

test('should set cookie on res', async () => {
  const name = 'token name';
  const token = 'token';
  const res = {
    cookie: jest.fn(),
  };

  setCookie(name, token, res);

  expect(res.cookie).toHaveBeenCalledWith(name, token, expect.anything());
});

test('should set cookie to non secure when not in production', async () => {
  accessEnv.mockImplementationOnce(() => 'development');

  const name = 'token name';
  const token = 'token';
  const res = {
    cookie: jest.fn(),
  };

  setCookie(name, token, res);

  expect(res.cookie).toHaveBeenCalledWith(
    name,
    token,
    expect.objectContaining({ secure: false })
  );
});

test('should set cookie to secure in production', async () => {
  accessEnv.mockImplementationOnce(() => 'production');

  const name = 'token name';
  const token = 'token';
  const res = {
    cookie: jest.fn(),
  };

  setCookie(name, token, res);

  expect(res.cookie).toHaveBeenCalledWith(
    name,
    token,
    expect.objectContaining({ secure: true })
  );
});
