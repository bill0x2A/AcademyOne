import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import Dapp from './components/Dapp';

const theme = createTheme({
  palette: {
    primary: {
      main: 'blue',
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Dapp />
  </ThemeProvider>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
