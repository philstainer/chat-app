import { ArrowLeft } from 'react-feather';

import { StyledPage } from '../styles/StyledPage';
import { RegisterFormContainer } from '../containers/RegisterFormContainer';

export const Register = () => {
  return (
    <StyledPage>
      <StyledPage.Title size="large">Create Account</StyledPage.Title>

      <RegisterFormContainer />

      <StyledPage.Actions>
        <StyledPage.Action to="/login">
          <ArrowLeft size={24} />
          BACK
        </StyledPage.Action>
      </StyledPage.Actions>
    </StyledPage>
  );
};

export default Register;
