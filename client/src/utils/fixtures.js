import faker from 'faker';

export const FakeUser = (extra) => ({
  _id: faker.random.uuid(),
  email: faker.internet.email(),
  image: faker.image.image(),
  confirmed: faker.random.boolean(),
  blocked: faker.random.boolean(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...extra,
});
