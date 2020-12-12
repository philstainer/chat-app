import { Message } from '#graphql/message/message.model';
import { Chat } from '#graphql/chat/chat.model';
import { messageResolver } from '#graphql/message/message.resolver';
import { isAuthenticated } from '#utils/isAuthenticated';
import { selectedFields } from '#utils/selectedFields';
import { FakeObjectId, FakeMessage } from '#utils/fixtures';
import { PERMISSIONS_ERROR } from '#config/constants';

const { messages } = messageResolver.Query;

jest.mock('#graphql/message/message.model.js');
jest.mock('#graphql/chat/chat.model.js');
jest.mock('#utils/isAuthenticated.js');
jest.mock('#utils/selectedFields.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => [],
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const ctx = { userId: FakeObjectId() };
  await messages(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should get chat', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => [],
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const args = { input: { chatId: FakeObjectId() } };
  await messages(null, args, null, null);

  expect(findOneMock.findOne).toHaveBeenCalledWith(
    expect.objectContaining({
      _id: args.input.chatId,
    })
  );
});

test('should throw error when chat not found', async () => {
  const findOneMock = {
    findOne: jest.fn(() => findOneMock),
    select: () => findOneMock,
    lean: () => null,
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  await expect(() => messages()).rejects.toThrow(PERMISSIONS_ERROR);
});

test('should call selectedFields', async () => {
  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const fieldsMock = jest.fn();
  selectedFields.mockImplementationOnce(fieldsMock);

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => [],
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const info = { name: 1 };
  await messages(null, null, null, info);

  expect(fieldsMock).toHaveBeenCalledWith(info);
});

test('should get all messages for chat', async () => {
  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const messageMock = {
    find: jest.fn(() => messageMock),
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => [{ a: 1 }],
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const args = { input: { chatId: FakeObjectId(), limit: 25, skip: 5 } };

  await messages(null, args, null, null);

  expect(messageMock.find).toHaveBeenCalledWith({ chatId: args.input.chatId });
});

test('should return reversed order messages', async () => {
  const findOneMock = {
    findOne: () => findOneMock,
    select: () => findOneMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findOneMock.findOne);

  const fakeMessages = [FakeMessage(), FakeMessage()];

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => [...fakeMessages],
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const args = { input: { chatId: FakeObjectId() } };
  const result = await messages(null, args, null, null);

  expect(result).toEqual(fakeMessages.reverse());
});
