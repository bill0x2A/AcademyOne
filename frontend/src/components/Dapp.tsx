import * as React from 'react';
import { ethers } from 'ethers';
import { Routes, Route } from 'react-router';
import {
  Box,
} from '@chakra-ui/react';
import NoWalletDetected from './NoWalletDetected';
import { RINKEBY_NETWORK_ID, HARDHAT_NETWORK_ID } from '../constants/chain';
import { AddressProvider } from '../context/Address';
import { SignerProvider } from '../context/Signer';
import { ProviderProvider } from '../context/Provider';
import Navigation from './navigation/Navigation';
import Home from './pages/home/Home';
import Courses from './pages/courses/Courses';
import Course from './pages/course/CourseHomepage';
import Create from './pages/create/Create';
import Request from './pages/request/Request';
import Footer from './ui/Footer';
import { CustomWindow } from '../types';
import CreateRequest from './pages/createRequest/CreateRequest';
import Roadmap from './pages/roadmap/Roadmap';

declare let window: CustomWindow;

const Dapp: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = React.useState<string>();
  const [balance, setBalance] = React.useState<number>();
  const [txBeingSent, setTxBeingSent] = React.useState();
  const [txError, setTxError] = React.useState();
  const [networkError, setNetworkError] = React.useState<string>();
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider>();
  const [signer, setSigner] = React.useState<ethers.Signer>();

  const resetState = () => {
    console.log('resetting state');
    setSelectedAddress(undefined);
    setBalance(undefined);
    setTxBeingSent(undefined);
    setTxError(undefined);
    setNetworkError(undefined);
    setProvider(undefined);
  }

  const checkNetwork = () => {
    if (
        window.ethereum.networkVersion === RINKEBY_NETWORK_ID
        || window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError('Please connect Metamask to Rinkeby bossman');
    return false;
  }

  const initializeProvider = () => {
    const infuraProvider = new ethers.providers.InfuraProvider('rinkeby', {projectId: 'dc71b76f925b44fa80b501543e747644', projectSecret: 'e0807351b84347bb947c826e7ba09816'});
    setProvider(infuraProvider);
  }

  const initializeEthers = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    setSigner(provider.getSigner(0));
  }

  const dismissNetworkError = () => {
    setNetworkError(undefined);
  }

  const dismissTxError = () => {
    setTxError(undefined);
  }

  const listenForAccountChange = (): void => {
    window.ethereum.on('accountsChanged', ([newAddress]: any) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the 'Connected
      // list of sites allowed access to your addresses' (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return resetState(); // Kind of funky, just stops execution of setSelectedAddress
      }
      
      setSelectedAddress(newAddress);
    });
  }

  const listenForNetworkChange = ():void => {
    // We reset the dapp state if the network is changed
    window.ethereum.on('networkChanged', () => {
      resetState();
    });
  }

  const connectWallet = async () => {
    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

    if (!checkNetwork()) {
      return;
    }

    setSelectedAddress(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    listenForAccountChange();
    
    listenForNetworkChange();
  }

  React.useEffect(() => {
    if (selectedAddress) {
      initializeEthers();
    }
  }, [selectedAddress])

  React.useEffect(() => {
    initializeProvider();
  }, []);

  if (window.ethereum === undefined) return <NoWalletDetected/>

  return (
    <ProviderProvider value={provider}>
      <SignerProvider value={signer}>
          <AddressProvider value={selectedAddress}>
                <Navigation connectWallet={connectWallet}/>
                <Box pb={'300px'}>
                  <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/courses/:courseAddress' element={<Course/>}/>
                    <Route path='/courses/:courseAddress/newrequest' element={<CreateRequest/>}/>
                    <Route path='/courses/:courseAddress/requests/:requestIndex' element={<Request/>}/>
                    <Route path='/courses' element={<Courses/>}/>
                    <Route path='/create' element={<Create/>}/>
                    <Route path='/roadmap' element={<Roadmap/>}/>
                  </Routes>
                </Box>
                <Footer/>
          </AddressProvider>
      </SignerProvider>
    </ProviderProvider>
    );
};

export default Dapp;