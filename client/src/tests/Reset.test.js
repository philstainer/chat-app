import { screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { Route } from 'react-router-dom';
import { GraphQLError } from 'graphql';
import faker from 'faker';

import { FakeUser } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { RESET } from '../operations/mutations/reset';
import { Reset } from '../pages/Reset';

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

test('should call reset mutation on form submit, update cache and redirect on success', async () => {
  const token = faker.random.uuid();
  const password = 'Pa33ord12345!';
  const fakeUser = FakeUser();

  const resetMock = {
    request: {
      query: RESET,
      variables: { resetPasswordInput: { token, password } },
    },
    result: jest.fn(() => ({
      data: { reset: { __typename: 'User', ...fakeUser } },
    })),
  };

  const cache = new InMemoryCache();

  const { history } = renderWithRouter(
    <MockedProvider cache={cache} mocks={[resetMock]}>
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

  const updatedCache = cache.extract();
  const updatedUserCache = updatedCache[`User:${fakeUser._id}`];

  expect(updatedUserCache).toHaveProperty('_id', fakeUser._id);
  expect(updatedUserCache).toHaveProperty('email', fakeUser.email);
  expect(updatedUserCache).toHaveProperty('image', fakeUser.image);
  expect(updatedUserCache).toHaveProperty('confirmed', fakeUser.confirmed);

  expect(history.location.pathname).toEqual('/');
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
