import { sender } from '#graphql/message/resolvers/sender';

import { FakeObjectId } from '#utils/fixtures';

test('should call user loader with parent sender id', async () => {
  const ctx = {
    userLoader: {
      load: jest.fn(),
    },
  };

  const parent = {
    sender: FakeObjectId(),
  };

  sender(parent, null, ctx);

  expect(ctx.userLoader.load).toHaveBeenCalledWith(parent.sender.toString());
});
