import { $Page } from '../styles/$Page';
import { $Icons } from '../styles/$Icons';
import { RegisterFormContainer } from '../containers/RegisterFormContainer';

export const Register = () => {
  return (
    <$Page>
      <$Page.Title size="large">Create Account</$Page.Title>

      <RegisterFormContainer />

      <$Page.Actions>
        <$Page.Action to="/login">
          <$Icons.ArrowLeft size={24} />
          BACK
        </$Page.Action>
      </$Page.Actions>
    </$Page>
  );
};

export default Register;
