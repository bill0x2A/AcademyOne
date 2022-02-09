import React from 'react';


interface WaitingForTransactionMessageProps {
  txHash: string;
}

const WaitingForTransactionMessage: React.FC<WaitingForTransactionMessageProps> = ({
  txHash
}: WaitingForTransactionMessageProps) => (
  <div role='alert'>
    Waiting for transaction <strong>{txHash}</strong> to be mined
  </div>
)

export default WaitingForTransactionMessage;
