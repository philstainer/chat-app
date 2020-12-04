import faker from 'faker';

import { Message } from '../graphql/message/message.modal';
import { Chat } from '../graphql/chat/chat.modal';
import { messageResolver } from '../graphql/message/message.resolver';
import { isAuthenticated } from '../utils/isAuthenticated';
import { FakeObjectId, FakeMessage } from '../utils/fixtures';

const { addMessage } = messageResolver.Mutation;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../graphql/message/message.modal.js');
jest.mock('../graphql/chat/chat.modal.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const ctx = { req: { userId: FakeObjectId() } };
  await addMessage(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should create message for chat', async () => {
  const createMock = jest.fn();
  Message.create.mockImplementationOnce(createMock);

  const args = {
    input: { chatId: FakeObjectId(), text: faker.lorem.sentence(2) },
  };
  await addMessage(null, args, null, null);

  expect(createMock).toHaveBeenCalledWith(args.input);
});

test('should update chat with message id', async () => {
  const fakeMessage = FakeMessage();
  Message.create.mockImplementationOnce(() => fakeMessage);

  const updateMock = jest.fn();
  Chat.findByIdAndUpdate.mockImplementationOnce(updateMock);

  const args = { input: { chatId: FakeObjectId() } };
  await addMessage(null, args, null, null);

  expect(updateMock).toHaveBeenCalledWith(args.input.chatId, {
    $set: { lastMessage: fakeMessage._id },
  });
});

test('should return message', async () => {
  const fakeMessage = FakeMessage();
  Message.create.mockImplementationOnce(() => fakeMessage);

  const result = await addMessage(null, null, null, null);

  expect(result).toBe(fakeMessage);
});
