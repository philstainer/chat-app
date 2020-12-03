import faker from 'faker';

export const FakeUser = (extra) => ({
  _id: faker.random.uuid(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
  image: faker.image.image(),
  contacts: [],
  logs: {},
  state: {},
  verified: faker.random.boolean(),
  blocked: faker.random.boolean(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...extra,
});

export const FakeChat = (extra) => ({
  _id: faker.random.uuid(),
  participants: [],
  lastMessage: faker.lorem.sentence(5),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...extra,
});

export const FakeMessage = (extra) => ({
  _id: faker.random.uuid(),
  chatId: faker.random.uuid(),
  body: faker.lorem.sentence(5),
  sender: faker.random.uuid(),
  deliveredTo: [],
  seenBy: [],
  active: faker.random.boolean(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...extra,
});
