import { chatResolver } from '#graphql/chat/chat.resolver';
import { FakeObjectId } from '#utils/fixtures';

const { lastMessage } = chatResolver.Chat;

test('should not call loader when lastMessage is null', async () => {
  const parent = {
    lastMessage: null,
  };

  const ctx = {
    messageLoader: {
      load: jest.fn(),
    },
  };

  const result = lastMessage(parent, null, ctx, null);

  expect(result).toBeNull();
  expect(ctx.messageLoader.load).not.toHaveBeenCalled();
});

test('should call loader', async () => {
  const parent = {
    lastMessage: FakeObjectId(),
  };

  const ctx = {
    messageLoader: {
      load: jest.fn(),
    },
  };

  lastMessage(parent, null, ctx, null);

  expect(ctx.messageLoader.load).toHaveBeenCalledWith(parent.lastMessage);
});
