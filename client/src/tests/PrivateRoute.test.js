import { screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import { FakeUser } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { PrivateRoute } from '../components/PrivateRoute';
import { ME } from '../operations/queries/me';

test('should get user details on mount', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ data: { me: FakeUser() } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PrivateRoute exact path="/" component={() => <div>Private Route</div>} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(meMock.result).toHaveBeenCalled();
  });
});

test('should display error message', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ errors: [new GraphQLError('ME query')] })),
  };

  renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PrivateRoute exact path="/" component={() => <div>Private Route</div>} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/error: me query/i)).toBeInTheDocument();
  });
});

test('should render component when logged in', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ data: { me: FakeUser() } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PrivateRoute exact path="/" component={() => <div>Private Route</div>} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(meMock.result).toHaveBeenCalled();
  });

  expect(screen.getByText(/private route/i)).toBeInTheDocument();
});

test('should redirect when logged out', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ data: { me: null } })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PrivateRoute exact path="/" component={() => <div>Private Route</div>} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(meMock.result).toHaveBeenCalled();
  });

  expect(history.location.pathname).toEqual('/login');
});
