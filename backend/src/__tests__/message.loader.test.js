import { Message } from '../graphql/message/message.modal';
import { FakeMessage } from '../utils/fixtures';
import { messageLoader } from '../graphql/loaders/message.loader';

jest.mock('../graphql/message/message.modal.js');

test('should return participants', async () => {
  const foundMessages = [FakeMessage()];

  const findMock = {
    find: jest.fn(() => findMock),
    lean: jest.fn(() => foundMessages),
  };
  Message.find.mockImplementationOnce(findMock.find);

  const loader = messageLoader();

  const result = await loader.loadMany([foundMessages[0]._id.toString()]);

  expect(findMock.find).toHaveBeenCalled();
  expect(findMock.lean).toHaveBeenCalled();

  expect(result).toMatchObject(foundMessages);
});
