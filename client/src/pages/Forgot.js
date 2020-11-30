import { ArrowLeft } from 'react-feather';

import { StyledPage } from '../styles/StyledPage';
import { ForgotFormContainer } from '../containers/ForgotFormContainer';

export const Forgot = () => {
  return (
    <StyledPage>
      <StyledPage.Title size="large">Forgot Password</StyledPage.Title>

      <ForgotFormContainer />

      <StyledPage.Actions>
        <StyledPage.Action to="/login">
          <ArrowLeft size={24} />
          BACK
        </StyledPage.Action>
      </StyledPage.Actions>
    </StyledPage>
  );
};

export default Forgot;
