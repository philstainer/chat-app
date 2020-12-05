import { User } from '../graphql/user/user.modal';
import { FakeUser } from '../utils/fixtures';
import { participantsLoader } from '../graphql/loaders/participants.loader';

jest.mock('../graphql/user/user.modal.js');

test('should filter out duplicates', async () => {
  const foundUsers = [FakeUser(), FakeUser()];

  const parentMock = {
    find: jest.fn(() => parentMock),
    lean: jest.fn(() => foundUsers),
  };
  User.find.mockImplementationOnce(parentMock.find);

  const participants = [
    foundUsers[0]._id,
    foundUsers[0]._id,
    foundUsers[1]._id,
  ];

  await participantsLoader.load(participants);

  const expected = {
    _id: {
      $in: [foundUsers[0]._id.toString(), foundUsers[1]._id.toString()],
    },
  };

  expect(parentMock.find).toHaveBeenCalledWith(expected);
  expect(parentMock.lean).toHaveBeenCalled();
});

test('should return participants', async () => {
  const foundUsers = [FakeUser(), FakeUser()];

  const parentMock = {
    find: jest.fn(() => parentMock),
    lean: jest.fn(() => foundUsers),
  };
  User.find.mockImplementationOnce(parentMock.find);

  const participants = [
    foundUsers[0]._id,
    foundUsers[0]._id,
    foundUsers[1]._id,
  ];

  const result = await participantsLoader.load(participants);

  const expected = [foundUsers[0], foundUsers[0], foundUsers[1]];

  expect(result).toMatchObject(expected);
});
