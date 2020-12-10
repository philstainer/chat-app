import faker from 'faker';
import { screen } from '@testing-library/react';

import { DynamicRoute } from '../components/DynamicRoute';
import { accessToken } from '../cache';
import { renderWithRouter } from '../utils/renderWithRouter';

const component = () => <div>component</div>;

test('should redirect when accessToken and authenticated prop', async () => {
  const { history } = renderWithRouter(
    <DynamicRoute path="/" component={component} authenticated />,
    { route: '/' }
  );

  expect(history.location.pathname).toEqual('/login');
});

test('should redirect when accessToken and guest prop', async () => {
  accessToken(faker.random.uuid());

  const { history } = renderWithRouter(
    <DynamicRoute path="/" component={component} guest />,
    { route: '/login' }
  );

  expect(history.location.pathname).toEqual('/');
});

test('should render component', async () => {
  accessToken(null);

  renderWithRouter(<DynamicRoute path="/" component={component} guest />, {
    route: '/login',
  });

  const expected = screen.getByText('component');
  expect(expected).toBeInTheDocument();
});
