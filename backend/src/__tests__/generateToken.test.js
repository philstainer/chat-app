import { generateToken } from '../utils/generateToken';

test('should generate default 60 length token', async () => {
  const token = await generateToken();

  expect(token).toHaveLength(120);
});

test('should generate 16 length token', async () => {
  const token = await generateToken(16);

  expect(token).toHaveLength(32);
});
