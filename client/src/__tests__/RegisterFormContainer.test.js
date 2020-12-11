import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import faker from 'faker';

import { FakeToken } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { REGISTER } from '../operations/mutations/register';
import { RegisterFormContainer } from '../containers/RegisterFormContainer';
import { accessToken } from '../cache';
import { ACCESS_TOKEN } from '../utils/constants';

test('should call register mutation on form submit', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { register: { token: FakeToken() } } })),
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

test('should update localStorage with token and set accessToken', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';
  const token = FakeToken();

  const setItemMock = jest.fn();
  Storage.prototype.setItem = setItemMock;

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({ data: { register: { token } } })),
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

  expect(setItemMock).toHaveBeenCalledWith(ACCESS_TOKEN, token);
  expect(accessToken()).toBe(token);
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

test('should not redirect on already logged in error', async () => {
  const email = faker.internet.email();
  const password = 'Pa33ord12345!';

  const registerMock = {
    request: {
      query: REGISTER,
      variables: { registerInput: { email, password } },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('some other error')],
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

  expect(history.location.pathname).toEqual('/register');
});
