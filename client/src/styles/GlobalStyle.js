import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    padding: 0;
    margin: 0;
  }

  body {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    font-family: ${({ theme }) => theme.fonts[0]}, sans-serif;
    line-height: 1.3;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.background};
    overflow: hidden;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  a,
  a:visited,
  a:hover {
    text-decoration: none;
    color: inherit;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    color: inherit;
  }
`;
