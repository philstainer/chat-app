import { useHistory } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../operations/mutations/register';

export const RegisterFormContainer = () => {
  const history = useHistory();
  const { mutate } = useRegister();

  const onSubmit = async ({ username, email, password }) => {
    try {
      await mutate({
        variables: { registerInput: { username, email, password } },
      });
    } catch (error) {
      if (error?.message.match(/already logged in/i)) history.replace('/');
    }
  };

  return <RegisterForm onSubmit={onSubmit} />;
};
