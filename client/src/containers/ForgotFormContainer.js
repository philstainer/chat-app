import { useHistory } from 'react-router-dom';

import { ForgotForm } from '../components/ForgotForm';
import { useForgot } from '../operations/mutations/forgot';

export const ForgotFormContainer = () => {
  const history = useHistory();
  const { mutate } = useForgot();

  const onSubmit = async ({ email }) => {
    try {
      await mutate({ variables: { resetPasswordRequestInput: { email } } });

      history.replace('/');
    } catch (error) {}
  };

  return <ForgotForm onSubmit={onSubmit} />;
};
