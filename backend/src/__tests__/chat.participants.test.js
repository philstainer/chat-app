import { chatResolver } from '../graphql/chat/chat.resolver';
import { FakeUser } from '../utils/fixtures';

const { participants } = chatResolver.Chat;

test('should populate participants', async () => {
  const parentMock = {
    populate: () => parentMock,
    execPopulate: jest.fn(() => ({ participants: [] })),
  };
  await participants(parentMock, null, null, null);

  expect(parentMock.execPopulate).toHaveBeenCalled();
});

test('should return participants', async () => {
  const fakeParticipants = [FakeUser(), FakeUser()];

  const parentMock = {
    populate: () => parentMock,
    execPopulate: () => ({ participants: fakeParticipants }),
  };

  const results = await participants(parentMock, null, null, null);

  expect(results).toBe(fakeParticipants);
});
