import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { activeChat } from '../cache';

import { FakeChat } from '../utils/fixtures';

import { CHATS } from '../operations/queries/chats';
import { CHAT_CREATED } from '../operations/subscriptions/chatCreated';
import { ChatListContainer } from '../containers/ChatListContainer';

test('should fetch chats on mount', async () => {
  const fakeChats = [FakeChat(), FakeChat()];

  const chatMock = {
    request: { query: CHATS },
    result: jest.fn(() => ({ data: { chats: fakeChats } })),
  };

  const chatSubscribeMock = {
    request: { query: CHAT_CREATED, variables: {} },
    newData: jest.fn(() => ({ data: { chatCreated: FakeChat() } })),
  };

  render(
    <MockedProvider mocks={[chatMock, chatSubscribeMock]} addTypename={false}>
      <ChatListContainer />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(chatMock.result).toHaveBeenCalled());
});

test('should render chats', async () => {
  const fakeChats = [FakeChat(), FakeChat()];

  const chatMock = {
    request: { query: CHATS },
    result: jest.fn(() => ({ data: { chats: fakeChats } })),
  };

  const chatSubscribeMock = {
    request: { query: CHAT_CREATED, variables: {} },
    newData: jest.fn(() => ({ data: { chatCreated: FakeChat() } })),
  };

  render(
    <MockedProvider mocks={[chatMock, chatSubscribeMock]} addTypename={false}>
      <ChatListContainer />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(chatMock.result).toHaveBeenCalled());

  const firstChatParticipant = screen.getByText(
    fakeChats[0].participants[1].username
  );
  const secondChatParticipant = screen.getByText(
    fakeChats[1].participants[1].username
  );
  expect(firstChatParticipant).toBeInTheDocument();
  expect(secondChatParticipant).toBeInTheDocument();

  const userImages = screen.getAllByRole('img', { name: /user/i });
  expect(userImages[0]).toHaveProperty(
    'src',
    fakeChats[0].participants[1].image
  );

  expect(userImages[1]).toHaveProperty(
    'src',
    fakeChats[1].participants[1].image
  );
});

test('should set active chat onClick', async () => {
  const fakeChat = FakeChat();

  const chatMock = {
    request: { query: CHATS },
    result: jest.fn(() => ({ data: { chats: [fakeChat] } })),
  };

  const chatSubscribeMock = {
    request: { query: CHAT_CREATED, variables: {} },
    newData: jest.fn(() => ({ data: { chatCreated: FakeChat() } })),
  };

  render(
    <MockedProvider mocks={[chatMock, chatSubscribeMock]} addTypename={false}>
      <ChatListContainer />
    </MockedProvider>
  );

  await waitFor(() => expect(chatMock.result).toHaveBeenCalled());

  const chat = screen.getByTestId('chat');

  fireEvent.click(chat);

  expect(activeChat()._id).toBe(fakeChat._id);
});
