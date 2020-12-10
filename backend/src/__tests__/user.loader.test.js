import { User } from '../graphql/user/user.model';
import { FakeUser } from '../utils/fixtures';
import { userLoader } from '../graphql/loaders/user.loader';

jest.mock('../graphql/user/user.model.js');

test('should filter out duplicates', async () => {
  const foundUsers = [FakeUser(), FakeUser()];

  const findMock = {
    find: jest.fn(() => findMock),
    lean: jest.fn(() => foundUsers),
  };
  User.find.mockImplementationOnce(findMock.find);

  const participants = [
    foundUsers[0]._id.toString(),
    foundUsers[0]._id.toString(),
    foundUsers[1]._id.toString(),
  ];

  const loader = userLoader();
  await loader.loadMany(participants);

  const expected = {
    _id: {
      $in: [foundUsers[0]._id.toString(), foundUsers[1]._id.toString()],
    },
  };

  expect(findMock.find).toHaveBeenCalledWith(expected);
  expect(findMock.lean).toHaveBeenCalled();
});

test('should return participants', async () => {
  const foundUsers = [FakeUser(), FakeUser()];

  const parentMock = {
    find: jest.fn(() => parentMock),
    lean: jest.fn(() => foundUsers),
  };
  User.find.mockImplementationOnce(parentMock.find);

  const participants = [
    foundUsers[0]._id.toString(),
    foundUsers[0]._id.toString(),
    foundUsers[1]._id.toString(),
  ];

  const loader = userLoader();
  const result = await loader.loadMany(participants);

  const expected = [foundUsers[0], foundUsers[0], foundUsers[1]];

  expect(result).toMatchObject(expected);
});
