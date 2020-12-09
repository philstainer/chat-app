import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { $Form } from '../styles/$Form';
import { Button } from './Button';

const schema = yup.object().shape({
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

export const ResetForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { isSubmitting } = formState;

  return (
    <$Form onSubmit={handleSubmit(onSubmit)}>
      <$Form.Label htmlFor="password">NEW PASSWORD</$Form.Label>
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
        Reset Password
      </Button>
    </$Form>
  );
};

ResetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
