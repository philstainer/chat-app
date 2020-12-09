import { $Page } from '../styles/$Page';
import { $Icons } from '../styles/$Icons';
import { ResetFormContainer } from '../containers/ResetFormContainer';

export const Reset = () => {
  return (
    <$Page>
      <$Page.Title size="large">Reset Password</$Page.Title>

      <ResetFormContainer />

      <$Page.Actions>
        <$Page.Action to="/login">
          <$Icons.ArrowLeft size={24} />
          BACK
        </$Page.Action>
      </$Page.Actions>
    </$Page>
  );
};

export default Reset;
