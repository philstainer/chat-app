import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { $Form } from '../styles/$Form';
import { Button } from './Button';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('This field is required'),
  password: yup.string().required('This field is required'),
});

export const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { isSubmitting } = formState;

  return (
    <$Form onSubmit={handleSubmit(onSubmit)}>
      <$Form.Label htmlFor="email">EMAIL</$Form.Label>
      <$Form.Input id="email" name="email" type="text" ref={register} />
      <$Form.InputError>{errors.email?.message}</$Form.InputError>

      <$Form.Label htmlFor="password">PASSWORD</$Form.Label>
      <$Form.Input
        id="password"
        name="password"
        type="password"
        ref={register}
      />
      <$Form.InputError>{errors.password?.message}</$Form.InputError>

      <Button type="submit" loading={isSubmitting}>
        Login
      </Button>
    </$Form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
