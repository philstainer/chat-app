import { $Page } from '../styles/$Page';
import { $Icons } from '../styles/$Icons';
import { ForgotFormContainer } from '../containers/ForgotFormContainer';

export const Forgot = () => {
  return (
    <$Page>
      <$Page.Title size="large">Forgot Password</$Page.Title>

      <ForgotFormContainer />

      <$Page.Actions>
        <$Page.Action to="/login">
          <$Icons.ArrowLeft size={24} />
          BACK
        </$Page.Action>
      </$Page.Actions>
    </$Page>
  );
};

export default Forgot;
