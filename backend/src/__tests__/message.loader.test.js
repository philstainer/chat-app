import { Message } from '../graphql/message/message.modal';
import { FakeMessage } from '../utils/fixtures';
import { messageLoader } from '../graphql/loaders/message.loader';

jest.mock('../graphql/message/message.modal.js');

test('should return participants', async () => {
  const foundMessage = FakeMessage();

  const findMock = {
    find: jest.fn(() => findMock),
    lean: jest.fn(() => [foundMessage]),
  };
  Message.find.mockImplementationOnce(findMock.find);

  const result = await messageLoader.load(foundMessage._id);

  expect(findMock.find).toHaveBeenCalled();
  expect(findMock.lean).toHaveBeenCalled();

  expect(result).toMatchObject(foundMessage);
});
