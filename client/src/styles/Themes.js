const defaultStyles = {
  fontSizes: {
    root: '62.5%',
    small: '1.2rem',
    medium: '1.4rem',
    large: '2.8rem',
    xLarge: '5rem',
  },
  fonts: ['Open Sans'],
  fontWeights: {
    light: 300,
    normal: 400,
    bold: 600,
  },
  highlight: 'rgba(0, 109, 238, 1)',
};

export const themes = {
  light: {
    ...defaultStyles,
    background: 'rgba(245, 246, 250, 1)',
    text: 'rgba(34, 40, 49, 1)',
  },
  dark: {
    ...defaultStyles,
    background: 'rgba(34, 40, 49, 1)',
    text: 'rgba(245, 246, 250, 1)',
  },
};
