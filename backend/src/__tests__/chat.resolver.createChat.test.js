import faker from 'faker';

import { Chat } from '../graphql/chat/chat.modal';
import { chatResolver } from '../graphql/chat/chat.resolver';
import { isAuthenticated } from '../utils/isAuthenticated';
import { FakeChat } from '../utils/fixtures';
import { INVALID_PARTICIPANTS_ERROR } from '../utils/constants';

const { createChat } = chatResolver.Mutation;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../utils/selectedFields.js');
jest.mock('../graphql/chat/chat.modal.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const createMock = jest.fn();
  Chat.create.mockImplementationOnce(createMock);

  const args = { input: { participants: [faker.random.uuid()] } };
  const ctx = { req: { userId: faker.random.uuid() } };

  await createChat(null, args, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should filter out logged in userId', async () => {
  const createMock = jest.fn();
  Chat.create.mockImplementationOnce(createMock);

  const ctx = { req: { userId: faker.random.uuid() } };
  const args = {
    input: { participants: [ctx.req.userId, faker.random.uuid()] },
  };

  await createChat(null, args, ctx, null);

  expect(createMock).toHaveBeenCalledWith({
    participants: args.input.participants,
  });
});

test('should throw error when empty participants', async () => {
  const args = { input: { participants: [] } };
  const ctx = { req: { userId: faker.random.uuid() } };

  await expect(() => createChat(null, args, ctx, null)).rejects.toThrow(
    INVALID_PARTICIPANTS_ERROR
  );
});

test('should create chat with participants and current user', async () => {
  const createMock = jest.fn();
  Chat.create.mockImplementationOnce(createMock);

  const args = { input: { participants: [faker.random.uuid()] } };
  const ctx = { req: { userId: faker.random.uuid() } };
  await createChat(null, args, ctx, null);

  expect(createMock).toHaveBeenCalled();
});

test('should return chat', async () => {
  const fakeChat = FakeChat();

  const createMock = () => fakeChat;
  Chat.create.mockImplementationOnce(createMock);

  const args = { input: { participants: [faker.random.uuid()] } };
  const ctx = { req: { userId: faker.random.uuid() } };
  const result = await createChat(null, args, ctx, null);

  expect(result).toBe(fakeChat);
});
