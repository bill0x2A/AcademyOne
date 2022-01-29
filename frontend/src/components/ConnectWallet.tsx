import React from 'react';

import NetworkErrorMessage from './NetworkErrorMessage';

interface ConnectWalletProps {
  connectWallet: () => void;
  networkError?: string;
  dismiss: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  connectWallet,
  networkError,
  dismiss,
}: ConnectWalletProps) => {
  return (
    <div className='container'>
      <div className='row justify-content-md-center'>
        <div className='col-12 text-center'>
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className='col-6 p-4 text-center'>
          <p>Please connect to your wallet.</p>
          <button
            className='btn btn-warning'
            type='button'
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
} 

export default ConnectWallet;
