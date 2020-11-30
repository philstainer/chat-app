import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { StyledForm } from '../styles/StyledForm';
import { Button } from './Button';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('This field is required'),
});

export const ForgotForm = ({ onSubmit }) => {
  const { register, handleSubmit, errors, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const { isSubmitting } = formState;

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledForm.Label htmlFor="email">EMAIL</StyledForm.Label>
      <StyledForm.Input
        id="email"
        name="email"
        type="text"
        ref={register}
        data-testid="email"
      />
      <StyledForm.InputError>{errors.email?.message}</StyledForm.InputError>

      <Button type="submit" loading={isSubmitting}>
        Send reset
      </Button>
    </StyledForm>
  );
};

ForgotForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
