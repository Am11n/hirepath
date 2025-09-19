import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.bodyText};
    font-family: ${props => props.theme.typography.fontFamily};
    margin: 0;
    padding: 0;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.colors.headings};
    margin-top: 0;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: ${props => props.theme.typography.fontFamily};
  }

  input, textarea, select {
    font-family: ${props => props.theme.typography.fontFamily};
  }

  // Focus styles for accessibility
  *:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;