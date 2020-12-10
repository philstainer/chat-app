import { screen } from '@testing-library/react';

import { Register } from '../pages/Register';
import { renderWithRouter } from '../utils/renderWithRouter';

jest.mock('../containers/RegisterFormContainer', () => {
  return {
    RegisterFormContainer: () => <div>RegisterFormContainer</div>,
  };
});

test('should render title', async () => {
  renderWithRouter(<Register />);

  expect(screen.getByText(/create account/i)).toBeInTheDocument();
});

test('should render link', async () => {
  renderWithRouter(<Register />);

  expect(screen.getByText(/back/i)).toBeInTheDocument();
});
