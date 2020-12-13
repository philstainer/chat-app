import { sign, decode } from 'jsonwebtoken';

import { FakeObjectId } from '#utils/fixtures';
import {
  signAsync,
  verifyAsync,
  decodeAsync,
  defaultOptions,
} from '#utils/jwt';

jest.mock('#utils/accessEnv', () => ({ accessEnv: () => 'secret' }));

test('should generate token with payload', async () => {
  const payload = { _id: FakeObjectId().toString() };

  const token = await signAsync(payload);

  const decoded = decode(token);
  expect(decoded).toMatchObject(payload);
});

test('should verify token', async () => {
  const payload = { _id: FakeObjectId().toString() };

  const token = await sign(payload, 'secret', defaultOptions);

  const data = await verifyAsync(token, defaultOptions);

  expect(data).toMatchObject(payload);
});

test('should decode token', async () => {
  const payload = { _id: FakeObjectId().toString() };

  const token = await sign(payload, 'secret');

  const data = await decodeAsync(token);

  expect(data).toMatchObject(payload);
});
