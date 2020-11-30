import { StyledPage } from '../styles/StyledPage';
import { LoginFormContainer } from '../containers/LoginFormContainer';

export const Login = () => {
  return (
    <StyledPage>
      <StyledPage.Title>ChatSafe</StyledPage.Title>
      <StyledPage.Description>
        Safe secure messaging made simple
      </StyledPage.Description>

      <LoginFormContainer />

      <StyledPage.Actions>
        <StyledPage.Action to="/forgot">FORGOT DETAILS?</StyledPage.Action>

        <StyledPage.Action color="highlight" to="/register">
          CREATE ACCOUNT
        </StyledPage.Action>
      </StyledPage.Actions>
    </StyledPage>
  );
};

export default Login;
