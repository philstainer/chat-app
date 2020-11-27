import { useEffect, useState } from 'react';

// Get theme from localStorage or default to light
const currentTheme = window?.localStorage?.getItem('theme') || 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState(currentTheme);

  // Set theme
  const setMode = (mode) => {
    window.localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  // Toggle between light and dark
  const themeToggler = () => {
    theme === 'light' ? setMode('dark') : setMode('light');
  };

  // Add theme listeners on mount
  useEffect(() => {
    const handleSystemThemeChange = (e) => {
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

  return [theme, themeToggler];
};
