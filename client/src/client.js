import { ApolloClient } from '@apollo/client';

import { cache } from './cache';
import { link } from './link';
import { IS_DEV } from './utils/constants';

export const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: IS_DEV,
});
