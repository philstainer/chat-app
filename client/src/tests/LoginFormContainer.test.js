import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { GraphQLError } from 'graphql';
import faker from 'faker';

import { FakeUser } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { LOGIN } from '../operations/mutations/login';
import { LoginFormContainer } from '../containers/LoginFormContainer';

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

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { login: FakeUser() } })),
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

test('should update local cache', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';
  const fakeUser = FakeUser();

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({
      data: { login: { __typename: 'User', ...fakeUser } },
    })),
  };

  const cache = new InMemoryCache();

  renderWithRouter(
    <MockedProvider cache={cache} mocks={[loginMock]}>
      <LoginFormContainer />
    </MockedProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });

  fireEvent.click(submitButton);

  await waitFor(() => expect(loginMock.result).toHaveBeenCalled());

  const updatedCache = cache.extract();
  const updatedUserCache = updatedCache[`User:${fakeUser._id}`];

  expect(updatedUserCache).toHaveProperty('_id', fakeUser._id);
  expect(updatedUserCache).toHaveProperty('email', fakeUser.email);
  expect(updatedUserCache).toHaveProperty('image', fakeUser.image);
  expect(updatedUserCache).toHaveProperty('confirmed', fakeUser.confirmed);
});

test('should redirect after mutation', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const loginMock = {
    request: {
      query: LOGIN,
      variables: { loginInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { login: FakeUser() } })),
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
