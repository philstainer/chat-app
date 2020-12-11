import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';

import { THEME } from '../utils/constants';
import { activeTheme } from '../cache';

export const useTheme = () => {
  const theme = useReactiveVar(activeTheme);

  // Set theme
  const setMode = mode => {
    window.localStorage.setItem(THEME, mode);
    activeTheme(mode);
  };

  // Toggle between light and dark
  const themeToggler = () =>
    theme === 'light' ? setMode('dark') : setMode('light');

  // Add theme listeners on mount
  useEffect(() => {
    const handleSystemThemeChange = e => {
      const newColorScheme = e.matches ? 'dark' : 'light';

      setMode(newColorScheme);
    };

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return { theme, themeToggler };
};
