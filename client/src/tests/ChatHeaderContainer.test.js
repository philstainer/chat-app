import { render, screen, fireEvent } from '@testing-library/react';

import { activeChat } from '../cache';
import { ChatHeaderContainer } from '../containers/ChatHeaderContainer';
import { FakeChat } from '../utils/fixtures';

test('should render back arrow', async () => {
  render(<ChatHeaderContainer />);

  const svg = screen.getByTestId('goBack');

  expect(svg).toBeInTheDocument();
});

test('should set activeChat to null on back arrow click', async () => {
  const fakeChat = FakeChat();

  activeChat(fakeChat._id);

  render(<ChatHeaderContainer />);

  expect(activeChat()).toBe(fakeChat._id);

  const svg = screen.getByTestId('goBack');
  fireEvent.click(svg);

  expect(activeChat()).toBeNull();
});
