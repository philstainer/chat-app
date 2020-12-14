import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { $Form } from '../styles/$Form';
import { Button } from './Button';

const schema = yup.object().shape({
  emailOrUsername: yup.string().required('This field is required'),
  password: yup.string().required('This field is required'),
});

export const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { isSubmitting } = formState;

  return (
    <$Form onSubmit={handleSubmit(onSubmit)}>
      <$Form.Label htmlFor="emailOrUsername">USERNAME / EMAIL</$Form.Label>
      <$Form.Input
        id="emailOrUsername"
        name="emailOrUsername"
        type="text"
        ref={register}
      />
      <$Form.InputError>{errors.emailOrUsername?.message}</$Form.InputError>

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
