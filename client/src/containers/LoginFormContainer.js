import { useHistory } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../operations/mutations/login';

export const LoginFormContainer = () => {
  const history = useHistory();
  const { mutate } = useLogin();

  const onSubmit = async ({ email, password }) => {
    try {
      await mutate({ variables: { loginInput: { email, password } } });

      history.replace('/');
    } catch (error) {
      if (error?.message.match(/already logged in/i))
        return history.replace('/');
    }
  };

  return <LoginForm onSubmit={onSubmit} />;
};
