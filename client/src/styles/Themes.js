import { rem } from 'polished';

const white = 'rgba(255, 255, 255, 1)';
const offWhite = 'rgba(245, 246, 250, 1)';
const dark = 'rgba(34, 40, 49, 1)';
const darkLight = 'rgba(57, 62, 70, 1)';
const border = 'rgba(112, 112, 112, .2)';
const highlight = 'rgba(0, 109, 238, 1)';
const error = 'rgba(232, 49, 81, 1)';

const globalStyles = {
  fontSizes: {
    xSmall: rem('12px'),
    small: rem('14px'),
    medium: rem('16px'),
    large: rem('28px'),
    xLarge: rem('50px'),
  },
  fonts: ['Open Sans'],
  fontWeights: {
    light: 300,
    normal: 400,
    bold: 600,
  },
  highlight,
  border,
  white,
  error,
};

export const themes = {
  light: {
    ...globalStyles,
    background: offWhite,
    backgroundLight: white,
    text: dark,
  },
  dark: {
    ...globalStyles,
    background: dark,
    backgroundLight: darkLight,
    text: offWhite,
  },
};
