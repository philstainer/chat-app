import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

test('should render button', async () => {
  render(<Button>Add</Button>);

  expect(screen.getByTestId('StyledButton')).toBeInTheDocument();
});

test('should render button with props', async () => {
  const handleClick = jest.fn();

  render(<Button onClick={handleClick}>Add</Button>);

  fireEvent.click(screen.getByTestId('StyledButton'));

  expect(handleClick).toHaveBeenCalled();
});

test('should handle loading prop', async () => {
  render(<Button loading={true}>Add</Button>);

  expect(screen.getByTestId('StyledButton')).toBeDisabled();
  expect(screen.getByTestId('StyledButton.Loader')).toBeInTheDocument();
});
