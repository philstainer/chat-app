import faker from 'faker';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { RegisterForm } from '../components/RegisterForm';

test('should render form', async () => {
  render(<RegisterForm onSubmit={() => {}} />);

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/create password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
});

test('should render errors on submit', async () => {
  render(<RegisterForm onSubmit={() => {}} />);

  const registerButton = screen.getByText(/register/i);
  fireEvent.click(registerButton);

  await waitFor(() =>
    expect(screen.getAllByText(/field is required/i)).toHaveLength(3)
  );
});

test('should render password error on weak password', async () => {
  render(<RegisterForm onSubmit={() => {}} />);

  const passwordInput = screen.getByLabelText(/create password/i);
  const registerButton = screen.getByText(/register/i);

  fireEvent.change(passwordInput, { target: { value: 'short' } });
  fireEvent.click(registerButton);
  await waitFor(() =>
    expect(screen.getByText(/must contain/i)).toBeInTheDocument()
  );

  fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
  fireEvent.click(registerButton);
  await waitFor(() =>
    expect(screen.queryByText(/must contain/i)).not.toBeInTheDocument()
  );

  fireEvent.change(passwordInput, { target: { value: 'Password123' } });
  fireEvent.click(registerButton);
  await waitFor(() =>
    expect(screen.getByText(/must contain/i)).toBeInTheDocument()
  );
});

test('should submit valid form', async () => {
  const onSubmitMock = jest.fn();

  render(<RegisterForm onSubmit={onSubmitMock} />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/create password/i);
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
  const registerButton = screen.getByText(/register/i);

  const email = faker.internet.email();
  const strongPassword = 'Pa33ord12345!';

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: strongPassword } });
  fireEvent.change(confirmPasswordInput, { target: { value: strongPassword } });

  fireEvent.click(registerButton);

  await waitFor(() => expect(registerButton).toBeDisabled());

  expect(onSubmitMock).toHaveBeenCalled();

  await waitFor(() => expect(registerButton).not.toBeDisabled());
});
