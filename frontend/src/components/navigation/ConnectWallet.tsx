import React from 'react';
import { Button } from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';

interface ConnectWalletProps {
  connectWallet: () => void;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({
  connectWallet,
}: ConnectWalletProps) => {
  return <Button rightIcon={<FaWallet/>} onClick={connectWallet}>Connect Wallet</Button> 
} 

export default ConnectWallet;