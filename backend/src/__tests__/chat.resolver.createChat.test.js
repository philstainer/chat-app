import { Chat } from '../graphql/chat/chat.model';
import { chatResolver } from '../graphql/chat/chat.resolver';
import { pubsub } from '../graphql/pubsub';
import { isAuthenticated } from '../utils/isAuthenticated';
import { FakeChat, FakeObjectId } from '../utils/fixtures';
import { INVALID_PARTICIPANTS_ERROR, CHAT_CREATED } from '../utils/constants';

const { createChat } = chatResolver.Mutation;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../utils/selectedFields.js');
jest.mock('../graphql/chat/chat.model.js');
jest.mock('../graphql/pubsub.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const createMock = jest.fn();
  Chat.create.mockImplementationOnce(createMock);

  const args = { input: { participants: [FakeObjectId()] } };
  const ctx = { req: { userId: FakeObjectId() } };

  await createChat(null, args, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should filter out logged in userId', async () => {
  const createMock = jest.fn();
  Chat.create.mockImplementationOnce(createMock);

  const ctx = { req: { userId: FakeObjectId() } };
  const args = {
    input: { participants: [ctx.req.userId, FakeObjectId()] },
  };

  await createChat(null, args, ctx, null);

  expect(createMock).toHaveBeenCalledWith({
    participants: args.input.participants,
  });
});

test('should throw error when empty participants', async () => {
  const args = { input: { participants: [] } };
  const ctx = { req: { userId: FakeObjectId() } };

  await expect(() => createChat(null, args, ctx, null)).rejects.toThrow(
    INVALID_PARTICIPANTS_ERROR
  );
});

test('should create chat with participants and current user', async () => {
  const createMock = jest.fn();
  Chat.create.mockImplementationOnce(createMock);

  const args = { input: { participants: [FakeObjectId()] } };
  const ctx = { req: { userId: FakeObjectId() } };
  await createChat(null, args, ctx, null);

  expect(createMock).toHaveBeenCalled();
});

test('should publish created chat', async () => {
  const fakeChat = FakeChat();
  const createMock = jest.fn(() => fakeChat);
  Chat.create.mockImplementationOnce(createMock);

  const publishMock = jest.fn();
  pubsub.publish.mockImplementationOnce(publishMock);

  const args = { input: { participants: [FakeObjectId()] } };
  const ctx = { req: { userId: FakeObjectId() } };
  await createChat(null, args, ctx, null);

  expect(publishMock).toHaveBeenCalledWith(CHAT_CREATED, {
    chatCreated: fakeChat,
  });
});

test('should return chat', async () => {
  const fakeChat = FakeChat();

  const createMock = () => fakeChat;
  Chat.create.mockImplementationOnce(createMock);

  const args = { input: { participants: [FakeObjectId()] } };
  const ctx = { req: { userId: FakeObjectId() } };
  const result = await createChat(null, args, ctx, null);

  expect(result).toBe(fakeChat);
});
