import { Chat } from '../graphql/chat/chat.modal';
import { isParticipant } from '../utils/isParticipant';
import { GENERAL_ERROR } from '../utils/constants';
import { FakeObjectId } from '../utils/fixtures';

jest.mock('../graphql/chat/chat.modal.js');

test('should get chat via chatId and userId', async () => {
  const chatId = FakeObjectId();
  const userId = FakeObjectId();

  const findMock = {
    findOne: jest.fn(() => findMock),
    select: () => findMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findMock.findOne);

  await isParticipant(chatId, userId);

  const expected = { _id: chatId, participants: { $in: [userId] } };
  expect(findMock.findOne).toHaveBeenCalledWith(expected);
});

test('should throw error if chat not found', async () => {
  const findMock = {
    findOne: jest.fn(() => findMock),
    select: () => findMock,
    lean: () => null,
  };
  Chat.findOne.mockImplementationOnce(findMock.findOne);

  await expect(() => isParticipant()).rejects.toThrow(GENERAL_ERROR);
});

test('should return true or false', async () => {
  const findMock = {
    findOne: jest.fn(() => findMock),
    select: () => findMock,
    lean: () => 'chat',
  };
  Chat.findOne.mockImplementationOnce(findMock.findOne);

  const result = await isParticipant();

  expect(result).toBe(true);
});
