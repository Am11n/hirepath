import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.bodyText};
    font-family: ${theme.typography.fontFamily};
    margin: 0;
    padding: 0;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${theme.colors.headings};
    margin-top: 0;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: ${theme.typography.fontFamily};
  }

  input, textarea, select {
    font-family: ${theme.typography.fontFamily};
  }

  // Focus styles for accessibility
  *:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;