import React from 'react';

interface NoTokensMessageProps {
  selectedAddress: string;
}

const NoTokensMessage: React.FC<NoTokensMessageProps> = ({
  selectedAddress,
}: NoTokensMessageProps) => {
  return (
    <>
      <p>You don't have tokens to transfer</p>
      <p>
        To get some tokens, open a terminal in the root of the repository and run: 
        <br />
        <br />
        <code>npx hardhat --network localhost faucet {selectedAddress}</code>
      </p>
    </>
  );
}

export default NoTokensMessage;
