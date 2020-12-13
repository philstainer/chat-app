import { randomTokenString } from '#utils/randomTokenString';

test('should return random hex string', async () => {
  const randomToken = randomTokenString();

  expect(randomToken).toHaveLength(80);
});

test('should return random hex string with custom length', async () => {
  const randomToken = randomTokenString(20);

  expect(randomToken).toHaveLength(40);
});
