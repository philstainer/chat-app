import { waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { Route } from 'react-router-dom';
import faker from 'faker';

import { renderWithRouter } from '../utils/renderWithRouter';

import { VERIFY } from '../operations/mutations/verify';
import { VerifyContainer } from '../containers/VerifyContainer';

test('should call verify mutation on mount', async () => {
  const token = faker.random.uuid();

  const verifyMock = {
    request: {
      query: VERIFY,
      variables: { confirmAccountInput: { token } },
    },
    result: jest.fn(() => ({ data: { verify: true } })),
  };

  renderWithRouter(
    <MockedProvider mocks={[verifyMock]} addTypename={false}>
      <Route path="/verify/:token">
        <VerifyContainer />
      </Route>
    </MockedProvider>,
    { route: `/verify/${token}` }
  );

  await waitFor(() => expect(verifyMock.result).toHaveBeenCalled());
});

test('should redirect after mutation', async () => {
  const token = faker.random.uuid();

  const verifyMock = {
    request: {
      query: VERIFY,
      variables: { confirmAccountInput: { token } },
    },
    result: jest.fn(() => ({ data: { verify: true } })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[verifyMock]} addTypename={false}>
      <Route path="/verify/:token">
        <VerifyContainer />
      </Route>
    </MockedProvider>,
    { route: `/verify/${token}` }
  );

  await waitFor(() => expect(verifyMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});

test('should redirect on error', async () => {
  const token = faker.random.uuid();

  const verifyMock = {
    request: {
      query: VERIFY,
      variables: { confirmAccountInput: { token } },
    },
    result: jest.fn(() => ({
      errors: [new GraphQLError('some error')],
    })),
  };

  const { history } = renderWithRouter(
    <MockedProvider mocks={[verifyMock]} addTypename={false}>
      <Route path="/verify/:token">
        <VerifyContainer />
      </Route>
    </MockedProvider>,
    { route: `/verify/${token}` }
  );

  await waitFor(() => expect(verifyMock.result).toHaveBeenCalled());

  expect(history.location.pathname).toEqual('/');
});
