import { render, screen } from '@testing-library/react';

import { activeChat } from '../cache';
import { ChatHeaderContainer } from '../containers/ChatHeaderContainer';
import { FakeChat } from '../utils/fixtures';

test('should render header', async () => {
  const fakeChat = FakeChat();

  activeChat(fakeChat);

  render(<ChatHeaderContainer />);

  const arrow = screen.getByTestId('arrow');
  const video = screen.getByTestId('video');
  const phone = screen.getByTestId('phone');

  const images = screen.getAllByRole('img', { name: /participant/i });
  const usernames = screen.getByTestId('usernames');

  expect(images).toHaveLength(2);
  expect(usernames).toBeInTheDocument();

  expect(arrow).toBeInTheDocument();
  expect(video).toBeInTheDocument();
  expect(phone).toBeInTheDocument();
});
