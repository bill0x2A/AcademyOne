import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import './index.css';
import Dapp from './components/Dapp';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Router>
      <Dapp />
    </Router>
  </ChakraProvider>,
  document.getElementById('root'),
);
