import faker from 'faker';
import mongoose from 'mongoose';

export const FakeObjectId = () => new mongoose.Types.ObjectId();
export const FakeToken = () => faker.random.uuid();

export const FakeUser = extra => ({
  _id: FakeObjectId(),
  username: faker.internet.userName(),
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

export const FakeChat = extra => ({
  _id: FakeObjectId(),
  participants: [],
  lastMessage: faker.lorem.sentence(5),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...extra,
});

export const FakeMessage = extra => ({
  _id: FakeObjectId(),
  chatId: FakeObjectId(),
  body: faker.lorem.sentence(5),
  sender: FakeObjectId(),
  deliveredTo: [],
  seenBy: [],
  active: faker.random.boolean(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...extra,
});
