import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { StyledForm } from '../styles/StyledForm';
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
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <StyledForm.Label htmlFor="password">NEW PASSWORD</StyledForm.Label>
      <StyledForm.Input
        id="password"
        name="password"
        type="password"
        ref={register}
        data-testid="password"
      />
      <StyledForm.InputError>{errors.password?.message}</StyledForm.InputError>

      <StyledForm.Label htmlFor="confirmPassword">
        CONFIRM PASSWORD
      </StyledForm.Label>
      <StyledForm.Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        ref={register}
        data-testid="confirmPassword"
      />
      <StyledForm.InputError>
        {errors.confirmPassword?.message}
      </StyledForm.InputError>

      <Button type="submit" loading={isSubmitting}>
        Reset Password
      </Button>
    </StyledForm>
  );
};

ResetForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
