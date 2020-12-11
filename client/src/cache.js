import { InMemoryCache, makeVar } from '@apollo/client';

import { ACCESS_TOKEN, THEME } from './utils/constants';

export const cache = new InMemoryCache();

// Local Storage
const theme = localStorage.getItem(THEME) ?? 'light';
const token = localStorage.getItem(ACCESS_TOKEN) ?? null;

// Reactive Vars
export const activeChat = makeVar(null);
export const activeTheme = makeVar(theme);
export const accessToken = makeVar(token);
