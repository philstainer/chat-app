import { Message } from '../graphql/message/message.modal';
import { messageResolver } from '../graphql/message/message.resolver';
import { isAuthenticated } from '../utils/isAuthenticated';
import { selectedFields } from '../utils/selectedFields';
import { FakeObjectId, FakeMessage } from '../utils/fixtures';

const { messages } = messageResolver.Query;

jest.mock('../utils/isAuthenticated.js');
jest.mock('../utils/selectedFields.js');
jest.mock('../utils/isParticipant.js');
jest.mock('../graphql/message/message.modal.js');

test('should call isAuthenticated', async () => {
  const authMock = jest.fn();
  isAuthenticated.mockImplementationOnce(authMock);

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => 'messages',
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const ctx = { req: { userId: FakeObjectId() } };
  await messages(null, null, ctx, null);

  expect(authMock).toHaveBeenCalledWith(ctx);
});

test('should call selectedFields', async () => {
  const fieldsMock = jest.fn();
  selectedFields.mockImplementationOnce(fieldsMock);

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => 'messages',
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const info = { name: 1 };
  await messages(null, null, null, info);

  expect(fieldsMock).toHaveBeenCalledWith(info);
});

test('should get all messages for chat', async () => {
  const messageMock = {
    find: jest.fn(() => messageMock),
    select: () => messageMock,
    sort: () => messageMock,
    limit: jest.fn(() => messageMock),
    skip: jest.fn(() => messageMock),
    lean: () => 'messages',
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const args = { input: { chatId: FakeObjectId(), limit: 25, skip: 5 } };
  await messages(null, args, null, null);

  expect(messageMock.find).toHaveBeenCalledWith({ chatId: args.input.chatId });
  expect(messageMock.limit).toHaveBeenCalledWith(args.input.limit);
  expect(messageMock.skip).toHaveBeenCalledWith(args.input.skip);
});

test('should return messages', async () => {
  const fakeMessages = [FakeMessage(), FakeMessage()];

  const messageMock = {
    find: () => messageMock,
    select: () => messageMock,
    sort: () => messageMock,
    limit: () => messageMock,
    skip: () => messageMock,
    lean: () => fakeMessages,
  };
  Message.find.mockImplementationOnce(messageMock.find);

  const args = { input: { chatId: FakeObjectId() } };
  const result = await messages(null, args, null, null);

  expect(result).toBe(fakeMessages);
});
