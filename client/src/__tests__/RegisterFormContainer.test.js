import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { GraphQLError } from 'graphql';
import faker from 'faker';

import { FakeUser } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { REGISTER } from '../operations/mutations/register';
import { RegisterFormContainer } from '../containers/RegisterFormContainer';

test('should call register mutation on form submit', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { register: FakeUser() } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[registerMock]} addTypename={false}>
      <RegisterFormContainer />
    </MockedProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/create password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const registerButton = screen.getByText(/register/i);

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });

  fireEvent.click(registerButton);

  await waitFor(() => expect(registerMock.result).toHaveBeenCalled());
});

test('should update local cache', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';
  const fakeUser = FakeUser();

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({
      data: { register: { __typename: 'User', ...fakeUser } },
    })),
  };

  const cache = new InMemoryCache();

  renderWithRouter(
    <MockedProvider cache={cache} mocks={[registerMock]}>
      <RegisterFormContainer />
    </MockedProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/create password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const registerButton = screen.getByText(/register/i);

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });

  fireEvent.click(registerButton);

  await waitFor(() => expect(registerMock.result).toHaveBeenCalled());

  const updatedCache = cache.extract();
  const updatedUserCache = updatedCache[`User:${fakeUser._id}`];

  expect(updatedUserCache).toHaveProperty('_id', fakeUser._id);
  expect(updatedUserCache).toHaveProperty('email', fakeUser.email);
  expect(updatedUserCache).toHaveProperty('image', fakeUser.image);
  expect(updatedUserCache).toHaveProperty('verified', fakeUser.verified);
});

test('should redirect after mutation', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { register: FakeUser() } })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[registerMock]} addTypename={false}>
      <RegisterFormContainer />
    </MockedProvider>,
    { route: '/register' }
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/create password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const registerButton = screen.getByText(/register/i);

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });

  fireEvent.click(registerButton);

  await waitFor(() => expect(registerMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});

test('should redirect on already logged in error', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('already logged in')],
    })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[registerMock]} addTypename={false}>
      <RegisterFormContainer />
    </MockedProvider>,
    { route: '/register' }
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/create password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const registerButton = screen.getByText(/register/i);

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.change(confirmPasswordInput, { target: { value: password } });

  fireEvent.click(registerButton);

  await waitFor(() => expect(registerMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});
