import * as React from 'react';
import { ethers } from 'ethers';
import { Container, Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router';
import TokenArtifact from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';
import NoWalletDetected from './NoWalletDetected';
import ConnectWallet from './ConnectWallet';
import { HARDHAT_NETWORK_ID } from '../constants/chain';
import { AddressProvider } from '../context/Address';
import { SignerProvider } from '../context/Signer';
import { ProviderProvider } from '../context/Provider';
import { ContractProvider } from '../context/Contract';
import Home from './pages/Home';



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
  const [tokenContract, setTokenContract] = React.useState<ethers.Contract>();

  const resetState = () => {
    console.log('resetting state');
    setTokenData(undefined);
    setSelectedAddress(undefined);
    setBalance(undefined);
    setTxBeingSent(undefined);
    setTxError(undefined);
    setNetworkError(undefined);
    setProvider(undefined);
    setTokenContract(undefined);
  }

  const updateBalance = async () => {
    if (!tokenContract) return;

    try {
      const balance: number = await tokenContract.balanceOf(selectedAddress);
      setBalance(balance);
    } catch (error) {
      console.error(error);
    }

  }
  
  const getTokenData = async (): Promise<void> => {
    if (!tokenContract) return;
    const name: string = await tokenContract.name();
    const symbol: string = await tokenContract.symbol();
    setTokenData({
      name,
      symbol,
    });
  }

  const checkNetwork = () => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError('Please connect Metamask to localhost:8545');
    return false;
  }

  const initializeEthers = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      provider.getSigner(0),
    )

    setProvider(provider);
    setSigner(provider.getSigner(0));
    setTokenContract(token);
  }

  const startPollingData = () => {
    setPollDataInterval(setInterval(() => updateBalance(), 10000))
    updateBalance();
  }

  const stopPollingData = () => {
    clearInterval(pollDataInterval);
  }

  const dismissNetworkError = () => {
    setNetworkError(undefined);
  }

  const dismissTxError = () => {
    setTxError(undefined);
  }

  const listenForAccountChange = (): void => {
    window.ethereum.on('accountsChanged', ([newAddress]: any) => {
      stopPollingData();
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
      stopPollingData();
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
    if (!!tokenContract) {
      getTokenData();
    }
  }, [tokenContract])

  React.useEffect(() => {
    if (!!tokenData) {
      startPollingData();
    }
  }, [tokenData]);

  if (window.ethereum === undefined) return <NoWalletDetected/>

  if (!selectedAddress) return <ConnectWallet
    connectWallet={connectWallet}
    networkError={networkError}
    dismiss={dismissNetworkError}/>

  return (
    <ProviderProvider value={provider}>
      <SignerProvider value={signer}>
        <ContractProvider value={tokenContract}>
          <AddressProvider value={selectedAddress}>
            <Routes>
              <Route path='/' element={<Home/>}/>
            </Routes>
          </AddressProvider>
        </ContractProvider>
      </SignerProvider>
    </ProviderProvider>
    );
};

export default Dapp;
