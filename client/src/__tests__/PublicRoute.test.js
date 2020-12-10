import { screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';

import { FakeUser } from '../utils/fixtures';
import { renderWithRouter } from '../utils/renderWithRouter';

import { PublicRoute } from '../components/PublicRoute';
import { ME } from '../operations/queries/me';

test('should get user details on mount', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ data: { me: FakeUser() } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PublicRoute
        exact
        path="/login"
        component={() => <div>Public Route</div>}
      />
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
      <PublicRoute exact path="/" component={() => <div>Public Route</div>} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/error: me query/i)).toBeInTheDocument();
  });
});

test('should render component when not logged in', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ data: { me: null } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PublicRoute exact path="/" component={() => <div>Public Route</div>} />
    </MockedProvider>
  );

  await waitFor(() => {
    expect(meMock.result).toHaveBeenCalled();
  });

  expect(screen.getByText(/Public route/i)).toBeInTheDocument();
});

test('should redirect when logged in', async () => {
  const meMock = {
    request: { query: ME },
    result: jest.fn(() => ({ data: { me: FakeUser() } })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[meMock]} addTypename={false}>
      <PublicRoute
        exact
        path="/login"
        component={() => <div>Public Route</div>}
      />
    </MockedProvider>,
    { route: '/login' }
  );

  await waitFor(() => {
    expect(meMock.result).toHaveBeenCalled();
  });

  expect(history.location.pathname).toEqual('/');
});
