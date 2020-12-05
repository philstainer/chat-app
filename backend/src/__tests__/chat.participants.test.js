import { chatResolver } from '../graphql/chat/chat.resolver';
import { FakeObjectId } from '../utils/fixtures';

const { participants } = chatResolver.Chat;

test('should call loader', async () => {
  const parent = {
    participants: [FakeObjectId(), FakeObjectId()],
  };

  const ctx = {
    userLoader: {
      loadMany: jest.fn(),
    },
  };

  participants(parent, null, ctx, null);

  const expected = [
    parent.participants[0]._id.toString(),
    parent.participants[1]._id.toString(),
  ];
  expect(ctx.userLoader.loadMany).toHaveBeenCalledWith(expected);
});
