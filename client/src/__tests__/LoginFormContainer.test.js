import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import faker from 'faker';

import { FakeToken } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { LOGIN } from '../operations/mutations/login';
import { LoginFormContainer } from '../containers/LoginFormContainer';
import { accessToken } from '../cache';
import { ACCESS_TOKEN } from '../utils/constants';

test('should render form', async () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <LoginFormContainer onSubmit={() => {}} />
    </MockedProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});

test('should render errors on submit', async () => {
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <LoginFormContainer onSubmit={() => {}} />
    </MockedProvider>
  );

  const submitButton = screen.getByRole('button', { name: /login/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    const formErrors = screen.getAllByText(/field is required/i);

    expect(formErrors).toHaveLength(2);
  });
});

test('should call login mutation on form submit', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';
  const token = FakeToken();

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { login: { token } } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[loginMock]} addTypename={false}>
      <LoginFormContainer onSubmit={() => {}} />
    </MockedProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });

  fireEvent.click(submitButton);

  await waitFor(() => expect(loginMock.result).toHaveBeenCalled());
});

test('should update localStorage with token and set accessToken', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';
  const token = FakeToken();

  const setItemMock = jest.fn();
  Storage.prototype.setItem = setItemMock;

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { login: { token } } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[loginMock]} addTypename={false}>
      <LoginFormContainer />
    </MockedProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const button = screen.getByText(/login/i);

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });

  fireEvent.click(button);

  await waitFor(() => expect(loginMock.result).toHaveBeenCalled());

  expect(setItemMock).toHaveBeenCalledWith(ACCESS_TOKEN, token);
  expect(accessToken()).toBe(token);
});

test('should redirect on already logged in error', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('already logged in')],
    })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[loginMock]} addTypename={false}>
      <LoginFormContainer />
    </MockedProvider>,
    { route: '/login' }
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });

  fireEvent.click(submitButton);

  await waitFor(() => expect(loginMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});

test('should not redirect on already logged in error', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('some other error')],
    })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[loginMock]} addTypename={false}>
      <LoginFormContainer />
    </MockedProvider>,
    { route: '/login' }
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });

  fireEvent.click(submitButton);

  await waitFor(() => expect(loginMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/login');
});
