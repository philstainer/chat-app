import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { FakeUser, FakeChat, FakeMessage } from '../utils/fixtures';

import { ME } from '../operations/queries/me';
import { MESSAGES } from '../operations/queries/messages';
import { MESSAGE_ADDED } from '../operations/subscriptions/messageAdded';
import { ChatContainer } from '../containers/ChatContainer';
import { activeChat } from '../cache';

window.HTMLElement.prototype.scrollIntoView = function () {};

test('should fetch me and messages on mount', async () => {
  const fakeChat = FakeChat();

  activeChat(fakeChat);

  const meMock = {
    request: {
      query: ME,
    },
    result: jest.fn(() => ({
      data: { me: FakeUser() },
    })),
  };

  const messagesMock = {
    request: {
      query: MESSAGES,
      variables: { messagesInput: { chatId: fakeChat._id } },
    },
    result: jest.fn(() => ({
      data: { messages: [FakeMessage(), FakeMessage()] },
    })),
  };

  const subscriptionMock = {
    request: { query: MESSAGE_ADDED, variables: {} },
    newData: jest.fn(() => ({ data: { messageAdded: FakeMessage() } })),
  };

  render(
    <MockedProvider
      mocks={[meMock, messagesMock, subscriptionMock]}
      addTypename={false}
    >
      <ChatContainer />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(meMock.result).toHaveBeenCalled());
  await waitFor(() => expect(messagesMock.result).toHaveBeenCalled());
});

test('should render messages correctly', async () => {
  const fakeUsers = [FakeUser(), FakeUser()];
  const fakeChat = FakeChat();
  const fakeMessages = [
    FakeMessage({ sender: fakeUsers[0] }),
    FakeMessage({ sender: fakeUsers[1] }),
  ];

  activeChat(fakeChat);

  const meMock = {
    request: {
      query: ME,
    },
    result: jest.fn(() => ({
      data: { me: fakeUsers[0] },
    })),
  };

  const messagesMock = {
    request: {
      query: MESSAGES,
      variables: { messagesInput: { chatId: fakeChat._id } },
    },
    result: jest.fn(() => ({
      data: { messages: fakeMessages },
    })),
  };

  const subscriptionMock = {
    request: { query: MESSAGE_ADDED, variables: {} },
    newData: jest.fn(() => ({ data: { messageAdded: FakeMessage() } })),
  };

  render(
    <MockedProvider
      mocks={[meMock, messagesMock, subscriptionMock]}
      addTypename={false}
    >
      <ChatContainer />
    </MockedProvider>
  );

  await waitFor(() => expect(messagesMock.result).toHaveBeenCalled());

  const firstMessage = screen.getByText(fakeMessages[0].text);
  const secondMessage = screen.getByText(fakeMessages[1].text);

  expect(firstMessage).toBeInTheDocument();
  expect(secondMessage).toBeInTheDocument();
});
