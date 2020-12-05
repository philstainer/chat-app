import { chatResolver } from '../graphql/chat/chat.resolver';
import { FakeObjectId } from '../utils/fixtures';

const { participants } = chatResolver.Chat;

test('should call loader', async () => {
  const parent = {
    participants: [FakeObjectId(), FakeObjectId()],
  };

  const ctx = {
    participantsLoader: {
      load: jest.fn(),
    },
  };

  participants(parent, null, ctx, null);

  expect(ctx.participantsLoader.load).toHaveBeenCalledWith(parent.participants);
});
