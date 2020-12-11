import faker from 'faker';

import { Message } from '../graphql/message/message.model';
import { Chat } from '../graphql/chat/chat.model';
import { messageResolver } from '../graphql/message/message.resolver';
import { isAuthenticated } from '../utils/isAuthenticated';
import { FakeObjectId, FakeMessage } from '../utils/fixtures';
import { pubsub } from '../graphql/pubsub';
import { MESSAGE_ADDED, PERMISSIONS_ERROR } from '../utils/constants';

const { addMessage } = messageResolver.Mutation;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../graphql/message/message.model.js');
jest.mock('../graphql/chat/chat.model.js');
jest.mock('../graphql/pubsub.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const ctx = { userId: FakeObjectId() };
  await addMessage(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should get chat', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const ctx = { userId: FakeObjectId() };
  await addMessage(null, null, ctx, null);

  expect(findOneMock.findOne).toHaveBeenCalled();
});

test('should throw error if chat not found', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  await expect(() => addMessage(null, null, null, null)).rejects.toThrow(
    PERMISSIONS_ERROR
  );
});

test('should create message for chat', async () => {
  const createMock = jest.fn();
  Message.create.mockImplementationOnce(createMock);

  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const args = {
    input: { chatId: FakeObjectId(), text: faker.lorem.sentence(2) },
  };
  await addMessage(null, args, null, null);

  expect(createMock).toHaveBeenCalledWith(args.input);
});

test('should update chat with lastMessage', async () => {
  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

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

test('should publish created message', async () => {
  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const fakeMessage = FakeMessage();
  Message.create.mockImplementationOnce(() => fakeMessage);

  const updateMock = jest.fn();
  Chat.findByIdAndUpdate.mockImplementationOnce(updateMock);

  const publishMock = jest.fn();
  pubsub.publish.mockImplementationOnce(publishMock);

  await addMessage(null, null, null, null);

  expect(publishMock).toHaveBeenCalledWith(MESSAGE_ADDED, {
    messageAdded: fakeMessage,
  });
});

test('should return message', async () => {
  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const fakeMessage = FakeMessage();
  Message.create.mockImplementationOnce(() => fakeMessage);

  const result = await addMessage(null, null, null, null);

  expect(result).toBe(fakeMessage);
});
