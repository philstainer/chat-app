import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { FakeChat, FakeMessage } from '../utils/fixtures';

import { ADD_MESSAGE } from '../operations/mutations/addMessage';
import { activeChat } from '../cache';
import { ChatFooterContainer } from '../containers/ChatFooterContainer';

test('should render svg and input', async () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <ChatFooterContainer />
    </MockedProvider>
  );

  const textarea = screen.getByRole('textbox');
  const submit = screen.getByRole('button');

  expect(textarea).toBeInTheDocument();
  expect(submit).toBeInTheDocument();
});

test('should call mutation when text not empty', async () => {
  const mutationMock = {
    request: {
      query: ADD_MESSAGE,
      variables: { messageInput: { chatId: null, text: '' } },
    },
    result: jest.fn(() => ({
      data: { addMessage: FakeMessage() },
    })),
  };

  render(
    <MockedProvider mocks={[mutationMock]} addTypename={false}>
      <ChatFooterContainer />
    </MockedProvider>
  );

  const submit = screen.getByRole('button');
  fireEvent.click(submit);

  await waitFor(() => expect(mutationMock.result).not.toHaveBeenCalled());
});

test('should call mutation and reset text', async () => {
  const fakeChat = FakeChat();
  const text = 'Hello, John!';

  activeChat(fakeChat);

  const mutationMock = {
    request: {
      query: ADD_MESSAGE,
      variables: { messageInput: { chatId: fakeChat._id, text } },
    },
    result: jest.fn(() => ({
      data: { addMessage: FakeMessage() },
    })),
  };

  render(
    <MockedProvider mocks={[mutationMock]} addTypename={false}>
      <ChatFooterContainer />
    </MockedProvider>
  );

  const textarea = screen.getByRole('textbox');
  const submit = screen.getByRole('button');

  fireEvent.change(textarea, { target: { value: text } });
  fireEvent.click(submit);

  expect(submit).toBeDisabled();
  expect(textarea).toBeDisabled();

  await waitFor(() => expect(mutationMock.result).toHaveBeenCalled());

  expect(submit).not.toBeDisabled();
  expect(textarea).not.toBeDisabled();
  expect(textarea.value).toBe('');
});
