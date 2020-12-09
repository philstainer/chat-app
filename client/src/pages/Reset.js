import { ArrowLeft } from 'react-feather';

import { $Page } from '../styles/$Page';
import { ResetFormContainer } from '../containers/ResetFormContainer';

export const Reset = () => {
  return (
    <$Page>
      <$Page.Title size="large">Reset Password</$Page.Title>

      <ResetFormContainer />

      <$Page.Actions>
        <$Page.Action to="/login">
          <ArrowLeft size={24} />
          BACK
        </$Page.Action>
      </$Page.Actions>
    </$Page>
  );
};

export default Reset;
