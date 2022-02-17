import * as React from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage'
import { Routes, Route } from 'react-router';
import TokenArtifact from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';
import NoWalletDetected from './NoWalletDetected';
import { RINKEBY_NETWORK_ID } from '../constants/chain';
import { AddressProvider } from '../context/Address';
import { SignerProvider } from '../context/Signer';
import { ProviderProvider } from '../context/Provider';
import { ContractProvider } from '../context/Contract';
import { StorageProvider } from'../context/Storage';
import Navigation from './navigation/Navigation';
import Home from './pages/home/Home';
import Courses from './pages/courses/Courses';
import Course from './pages/course/CourseHomepage';
import Create from './pages/create/Create';
import { CustomWindow } from '../types';

declare let window: CustomWindow;

const Dapp: React.FC = () => {
  const [tokenData, setTokenData] = React.useState<{name: string; symbol: string}>();
  const [pollDataInterval, setPollDataInterval] = React.useState<any>();
  const [selectedAddress, setSelectedAddress] = React.useState<string>();
  const [balance, setBalance] = React.useState<number>();
  const [txBeingSent, setTxBeingSent] = React.useState();
  const [txError, setTxError] = React.useState();
  const [networkError, setNetworkError] = React.useState<string>();
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = React.useState<ethers.Signer>();

  const web3StorageAPIKey = process.env.SNOWPACK_PUBLIC_STORAGE_API_KEY || '';
  const storage = new Web3Storage({ token: web3StorageAPIKey })

  const resetState = () => {
    console.log('resetting state');
    setTokenData(undefined);
    setSelectedAddress(undefined);
    setBalance(undefined);
    setTxBeingSent(undefined);
    setTxError(undefined);
    setNetworkError(undefined);
    setProvider(undefined);
  }

  const checkNetwork = () => {
    if (window.ethereum.networkVersion === RINKEBY_NETWORK_ID) {
      return true;
    }

    setNetworkError('Please connect Metamask to Rinkeby bossman');
    return false;
  }

  const initializeEthers = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    setProvider(provider);
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

  if (window.ethereum === undefined) return <NoWalletDetected/>

  return (
    <ProviderProvider value={provider}>
      <SignerProvider value={signer}>
          <AddressProvider value={selectedAddress}>
            <StorageProvider value={storage}>
                <Navigation connectWallet={connectWallet}/>
                <Routes>
                  <Route path='/' element={<Home/>}/>
                  <Route path='/courses/:courseAddress' element={<Course/>}/>
                  <Route path='/courses' element={<Courses/>}/>
                  <Route path='/create' element={<Create/>}/>
                </Routes>
            </StorageProvider>
          </AddressProvider>
      </SignerProvider>
    </ProviderProvider>
    );
};

export default Dapp;