import { InMemoryCache, makeVar } from '@apollo/client';

export const cache = new InMemoryCache();

// Reactive Vars
export const activeChat = makeVar(null);
