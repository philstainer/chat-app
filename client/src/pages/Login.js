import { $Page } from '../styles/$Page';
import { LoginFormContainer } from '../containers/LoginFormContainer';

export const Login = () => {
  return (
    <$Page>
      <$Page.Title>ChatSafe</$Page.Title>
      <$Page.Description>Safe secure messaging made simple</$Page.Description>

      <LoginFormContainer />

      <$Page.Actions>
        <$Page.Action to="/forgot">FORGOT DETAILS?</$Page.Action>

        <$Page.Action color="highlight" to="/register">
          CREATE ACCOUNT
        </$Page.Action>
      </$Page.Actions>
    </$Page>
  );
};

export default Login;
