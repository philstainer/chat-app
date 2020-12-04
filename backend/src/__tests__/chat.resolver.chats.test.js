import faker from 'faker';

import { Chat } from '../graphql/chat/chat.modal';
import { chatResolver } from '../graphql/chat/chat.resolver';
import { isAuthenticated } from '../utils/isAuthenticated';
import { selectedFields } from '../utils/selectedFields';
import { FakeChat } from '../utils/fixtures';

const { chats } = chatResolver.Query;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../utils/selectedFields.js');
jest.mock('../graphql/chat/chat.modal.js');

test('should call isAuthenticated', () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const chatMock = {
    find: jest.fn(() => chatMock),
    select: () => chatMock,
    lean: () => 'chat',
  };
  Chat.find.mockImplementationOnce(chatMock.find);

  const ctx = { req: { userId: faker.random.uuid() } };

  chats(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should call selectedFields', async () => {
  const fieldsMock = jest.fn();
  selectedFields.mockImplementationOnce(fieldsMock);

  const chatMock = {
    find: jest.fn(() => chatMock),
    select: () => chatMock,
    lean: () => 'chat',
  };
  Chat.find.mockImplementationOnce(chatMock.find);

  const info = { name: 1 };
  await chats(null, null, null, info);

  expect(fieldsMock).toHaveBeenCalledWith(info);
});

test('should get all chats for user via userId', async () => {
  const chatMock = {
    find: jest.fn(() => chatMock),
    select: () => chatMock,
    lean: () => 'chat',
  };
  Chat.find.mockImplementationOnce(chatMock.find);

  await chats(null, null, null, null);

  expect(chatMock.find).toHaveBeenCalled();
});

test('should return chats', async () => {
  const fakeChats = [FakeChat(), FakeChat()];

  const chatMock = {
    find: jest.fn(() => chatMock),
    select: () => chatMock,
    lean: () => fakeChats,
  };
  Chat.find.mockImplementationOnce(chatMock.find);

  const result = await chats(null, null, null, null);

  expect(result).toBe(fakeChats);
});