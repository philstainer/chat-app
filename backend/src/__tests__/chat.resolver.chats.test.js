import { Chat } from '#graphql/chat/chat.model';
import { chatResolver } from '#graphql/chat/chat.resolver';
import { isAuthenticated } from '#utils/isAuthenticated';
import { selectedFields } from '#utils/selectedFields';
import { FakeChat, FakeObjectId } from '#utils/fixtures';

const { chats } = chatResolver.Query;

jest.mock('#utils/isAuthenticated.js');
jest.mock('#utils/selectedFields.js');
jest.mock('#graphql/chat/chat.model.js');

test('should call isAuthenticated', () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const chatMock = {
    find: jest.fn(() => chatMock),
    select: () => chatMock,
    sort: () => chatMock,
    lean: () => 'chat',
  };
  Chat.find.mockImplementationOnce(chatMock.find);

  const ctx = { userId: FakeObjectId() };

  chats(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should call selectedFields', async () => {
  const fieldsMock = jest.fn();
  selectedFields.mockImplementationOnce(fieldsMock);

  const chatMock = {
    find: jest.fn(() => chatMock),
    select: () => chatMock,
    sort: () => chatMock,
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
    sort: () => chatMock,
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
    sort: () => chatMock,
    lean: () => fakeChats,
  };
  Chat.find.mockImplementationOnce(chatMock.find);

  const result = await chats(null, null, null, null);

  expect(result).toBe(fakeChats);
});
