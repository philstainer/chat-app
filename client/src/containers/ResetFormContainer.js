import { useHistory, useParams } from 'react-router-dom';
import { ResetForm } from '../components/ResetForm';
import { useReset } from '../operations/mutations/reset';

export const ResetFormContainer = () => {
  const history = useHistory();
  const { token } = useParams();

  const { mutate } = useReset();

  const onSubmit = async ({ password }) => {
    try {
      await mutate({ variables: { resetPasswordInput: { token, password } } });

      history.replace('/');
    } catch (error) {
      if (error?.message.match(/already logged in/i))
        return history.replace('/');
    }
  };

  return <ResetForm onSubmit={onSubmit} />;
};
