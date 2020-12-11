import { ACCESS_TOKEN, THEME } from './utils/constants';
import { accessToken, activeTheme } from './cache';

const storageEvents = ({ key, newValue }) => {
  if (key === ACCESS_TOKEN) {
    accessToken(newValue ?? null);
  }

  if (key === THEME) {
    activeTheme(newValue ?? 'light');
  }
};
window.addEventListener('storage', storageEvents);
