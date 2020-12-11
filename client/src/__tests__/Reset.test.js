import { screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { Route } from 'react-router-dom';
import { GraphQLError } from 'graphql';
import faker from 'faker';

import { FakeToken } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { RESET } from '../operations/mutations/reset';
import { Reset } from '../pages/Reset';
import { accessToken } from '../cache';
import { ACCESS_TOKEN } from '../utils/constants';

test('should render form', async () => {
  renderWithRouter(
    <MockedProvider>
      <Reset />
    </MockedProvider>
  );

  const title = screen.getByRole('heading', { name: /reset password/i });
  const passwordInput = screen.getByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });
  const backLink = screen.getByRole('link', { name: /back/i });

  expect(title).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
  expect(backLink).toBeInTheDocument();
});

test('should display form errors', async () => {
  renderWithRouter(
    <MockedProvider>
      <Reset />
    </MockedProvider>
  );

  const submitButton = screen.getByRole('button', { name: /reset password/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    const formErrors = screen.getAllByText(/this field is required/i);
    expect(formErrors).toHaveLength(2);
  });
});

test('should call reset mutation on form submit', async () => {
  const resetToken = FakeToken();
  const password = 'Pa33ord12345!';
  const token = FakeToken();

  const setItemMock = jest.fn();
  Storage.prototype.setItem = setItemMock;

  const resetMock = {
    request: {
      query: RESET,
      variables: { resetPasswordInput: { token: resetToken, password } },
    },
    result: jest.fn(() => ({
      data: { resetPassword: { token } },
    })),
  };

  renderWithRouter(
    <MockedProvider mocks={[resetMock]} addTypename={false}>
      <Route path="/reset/:token">
        <Reset />
      </Route>
    </MockedProvider>,
    { route: `/reset/${resetToken}` }
  );

  const passwordInput = screen.getByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });

  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });
  fireEvent.click(submitButton);

  await waitFor(() => expect(resetMock.result).toHaveBeenCalled());

  expect(setItemMock).toHaveBeenCalledWith(ACCESS_TOKEN, token);
  expect(accessToken()).toBe(token);
});

test('should redirect on already logged in error', async () => {
  const token = faker.random.uuid();
  const password = 'Pa33ord12345!';

  const resetMock = {
    request: {
      query: RESET,
      variables: { resetPasswordInput: { token, password } },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('already logged in')],
    })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[resetMock]} addTypename={false}>
      <Route path="/reset/:token">
        <Reset />
      </Route>
    </MockedProvider>,
    { route: `/reset/${token}` }
  );

  const passwordInput = screen.getByLabelText(/new password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const submitButton = screen.getByRole('button', { name: /reset password/i });

  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });
  fireEvent.click(submitButton);

  await waitFor(() => expect(resetMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});
