import { ArrowLeft } from 'react-feather';

import { StyledPage } from '../styles/StyledPage';
import { ResetFormContainer } from '../containers/ResetFormContainer';

export const Reset = () => {
  return (
    <StyledPage>
      <StyledPage.Title size="large">Reset Password</StyledPage.Title>

      <ResetFormContainer />

      <StyledPage.Actions>
        <StyledPage.Action to="/login">
          <ArrowLeft size={24} />
          BACK
        </StyledPage.Action>
      </StyledPage.Actions>
    </StyledPage>
  );
};

export default Reset;
