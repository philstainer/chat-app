import { screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import faker from 'faker';

import { renderWithRouter } from '../utils/renderWithRouter';

import { FORGOT } from '../operations/mutations/forgot';
import { Forgot } from '../pages/Forgot';

test('should render form', async () => {
  renderWithRouter(
    <MockedProvider>
      <Forgot />
    </MockedProvider>
  );

  const title = screen.getByRole('heading', { name: /forgot password/i });
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /send reset/i });
  const backLink = screen.getByRole('link', { name: /back/i });

  expect(title).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
  expect(backLink).toBeInTheDocument();
});

test('should display form errors', async () => {
  renderWithRouter(
    <MockedProvider>
      <Forgot />
    </MockedProvider>
  );

  const submitButton = screen.getByRole('button', { name: /send reset/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    const formError = screen.getByText(/this field is required/i);
    expect(formError).toBeInTheDocument();
  });
});

test('should call forgot mutation on form submit and redirect on success', async () => {
  const email = faker.internet.email();

  const forgotMock = {
    request: {
      query: FORGOT,
      variables: { resetPasswordRequestInput: { email } },
    },
    result: jest.fn(() => ({ data: { forgot: true } })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[forgotMock]} addTypename={false}>
      <Forgot />
    </MockedProvider>,
    { route: '/forgot' }
  );

  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /send reset/i });

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.click(submitButton);

  await waitFor(() => expect(forgotMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});
