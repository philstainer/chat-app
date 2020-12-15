import { participants } from '#graphql/chat/resolvers/participants';
import { FakeObjectId } from '#utils/fixtures';

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
