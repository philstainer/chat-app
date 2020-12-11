import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Verify } from '../components/Verify';
import { useVerify } from '../operations/mutations/verify';

export const VerifyContainer = () => {
  const history = useHistory();
  const { token } = useParams();

  const { mutate } = useVerify();

  const handleVerify = useCallback(async () => {
    try {
      await mutate({ variables: { confirmAccountInput: { token } } });

      history.replace('/');
    } catch (error) {
      history.replace('/');
    }
  }, [mutate, history, token]);

  return <Verify handleVerify={handleVerify} />;
};
