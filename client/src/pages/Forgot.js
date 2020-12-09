import { ArrowLeft } from 'react-feather';

import { $Page } from '../styles/$Page';
import { ForgotFormContainer } from '../containers/ForgotFormContainer';

export const Forgot = () => {
  return (
    <$Page>
      <$Page.Title size="large">Forgot Password</$Page.Title>

      <ForgotFormContainer />

      <$Page.Actions>
        <$Page.Action to="/login">
          <ArrowLeft size={24} />
          BACK
        </$Page.Action>
      </$Page.Actions>
    </$Page>
  );
};

export default Forgot;
