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

  const image = screen.getByRole('img', { name: /participants/i });
  const email = screen.getByTestId('email');

  expect(arrow).toBeInTheDocument();
  expect(video).toBeInTheDocument();
  expect(phone).toBeInTheDocument();
  expect(image).toBeInTheDocument();
  expect(email).toBeInTheDocument();
});
