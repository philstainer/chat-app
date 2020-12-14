import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { $Form } from '../styles/$Form';
import { Button } from './Button';

const schema = yup.object().shape({
  username: yup.string().required('This field is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('This field is required'),
  password: yup
    .string()
    .required('This field is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One special Character'
    ),
  confirmPassword: yup
    .string()
    .required('This field is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export const RegisterForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { isSubmitting } = formState;

  return (
    <$Form onSubmit={handleSubmit(onSubmit)} psmall>
      <$Form.Label htmlFor="username">USERNAME</$Form.Label>
      <$Form.Input
        id="username"
        name="username"
        type="text"
        ref={register}
        data-testid="username"
      />
      <$Form.InputError>{errors.username?.message}</$Form.InputError>

      <$Form.Label htmlFor="email">EMAIL</$Form.Label>
      <$Form.Input
        id="email"
        name="email"
        type="text"
        ref={register}
        data-testid="email"
      />
      <$Form.InputError>{errors.email?.message}</$Form.InputError>

      <$Form.Label htmlFor="password">CREATE PASSWORD</$Form.Label>
      <$Form.Input
        id="password"
        name="password"
        type="password"
        ref={register}
        data-testid="password"
      />
      <$Form.InputError>{errors.password?.message}</$Form.InputError>

      <$Form.Label htmlFor="confirmPassword">CONFIRM PASSWORD</$Form.Label>
      <$Form.Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        ref={register}
        data-testid="confirmPassword"
      />
      <$Form.InputError>{errors.confirmPassword?.message}</$Form.InputError>

      <Button type="submit" loading={isSubmitting}>
        Register
      </Button>
    </$Form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
