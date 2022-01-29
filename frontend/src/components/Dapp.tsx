import * as React from 'react';
import { ethers } from 'ethers';
import TokenArtifact from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';
import NoWalletDetected from './NoWalletDetected';
import ConnectWallet from './ConnectWallet';
import { Loading } from './Loading';
import Transfer from './Transfer';
import TransactionErrorMessage from './TransactionErrorMessage';
import WaitingForTransactionMessage from './WaitingForTransactionMessage';
import NoTokensMessage from './NoTokensMessage';
import type { RPCErrorType } from '../types';
import { HARDHAT_NETWORK_ID } from '../constants/chain';
import { ERROR_CODE_TX_REJECTED_BY_USER } from '../constants/errors';

const Dapp: React.FC = () => {
  const [tokenData, setTokenData] = React.useState<{name: string; symbol: string}>();
  const [pollDataInterval, setPollDataInterval] = React.useState<any>();
  const [selectedAddress, setSelectedAddress] = React.useState<string>();
  const [balance, setBalance] = React.useState<number>();
  const [txBeingSent, setTxBeingSent] = React.useState();
  const [txError, setTxError] = React.useState();
  const [networkError, setNetworkError] = React.useState<string>();
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider>();
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
  
  const getTokenData = async () => {
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

  const getRpcErrorMessage = (error: RPCErrorType): string => {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  const initializeEthers = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      provider.getSigner(0),
    )

    setProvider(provider)
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
        return resetState();
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
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

    // Once we have the address, we can initialize the application.

    // First we check the network
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

  const transferTokens = async (to: string, amount: number) => {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network.
    //   - It has to be mined, so it isn't immediately confirmed.
    //   - It can fail once mined.

    try {

      dismissTxError();

      if (!!tokenContract) {
        const tx = await tokenContract.transfer(to, amount);
        setTxBeingSent(tx.hash);
  
        const receipt = await tx.wait();

        if (receipt.status === 0) {
          // We can't know the exact error that made the transaction fail when it
          // was mined, so we throw this generic one.
          throw new Error('Transaction failed');
        }

        await updateBalance();
      }

    } catch (error: any) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      setTxError(error);
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      setTxBeingSent(undefined);
    }
  }

  if (window.ethereum === undefined) return <NoWalletDetected/>

  if (!selectedAddress) return <ConnectWallet
    connectWallet={connectWallet}
    networkError={networkError}
    dismiss={dismissNetworkError}/>

  return (
      <div className='container p-4'>
        <div className='row'>
          <div className='col-12'>
            <h1>
              {tokenData && `${tokenData.name} (${tokenData.symbol})`}
              {tokenData && tokenData.name} ({tokenData && tokenData.symbol})
            </h1>
            <p>
              Welcome <b>{selectedAddress}</b>, you have{' '}
              <b>
                {balance && balance.toString()} {tokenData && tokenData.symbol}
              </b>
              .
            </p>
          </div>
        </div>

        <hr />

        <div className='row'>
          <div className='col-12'>
            {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {txBeingSent && (
              <WaitingForTransactionMessage txHash={txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {txError && (
              <TransactionErrorMessage
                message={getRpcErrorMessage(txError)}
                dismiss={dismissTxError}
              />
            )}
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            {/*
              If the user has no tokens, we don't show the Tranfer form
            */}
            {balance === 0 && (
              <NoTokensMessage selectedAddress={selectedAddress} />
            )}

            {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
            {balance && balance > 0 && (
              <Transfer
                transferTokens={transferTokens}
                tokenSymbol={tokenData ? tokenData.symbol : ''}
              />
            )}
          </div>
        </div>
      </div>
    );
};

export default Dapp;
