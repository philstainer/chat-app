import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from '../styles/GlobalStyle';
import { themes } from '../styles/Themes';
import { useTheme } from '../hooks/useTheme';

export const Theme = ({ children }) => {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
