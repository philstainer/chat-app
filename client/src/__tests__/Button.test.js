import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';

test('should render button', async () => {
  render(<Button>Add</Button>);

  const button = screen.getByRole('button', { name: /add/i });
  expect(button).toBeInTheDocument();
});

test('should render button with props', async () => {
  const handleClick = jest.fn();

  render(<Button onClick={handleClick}>Add</Button>);

  const button = screen.getByRole('button', { name: /add/i });
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalled();
});

test('should handle loading prop', async () => {
  render(<Button loading={true}>Add</Button>);

  const loader = screen.getByTestId('$Button.Loader');
  expect(loader).toBeInTheDocument();
});
