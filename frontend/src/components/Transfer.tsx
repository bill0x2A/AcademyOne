import React from 'react';

interface TransferProps {
  transferTokens: (to: string, amount: number) => void;
  tokenSymbol: string;
}

const Transfer: React.FC<TransferProps> = ({
  transferTokens,
  tokenSymbol
}: TransferProps) => {
  return (
    <div>
      <h4>Transfer</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target as any);
          const to = formData.get('to');
          const amount: unknown = formData.get('amount');

          if (to && amount) {
            transferTokens(to as string, amount as number);
          }
        }}
      >
        <div className='form-group'>
          <label>Amount of {tokenSymbol}</label>
          <input
            className='form-control'
            type='number'
            step='1'
            name='amount'
            placeholder='1'
            required
          />
        </div>
        <div className='form-group'>
          <label>Recipient address</label>
          <input className='form-control' type='text' name='to' required />
        </div>
        <div className='form-group'>
          <input className='btn btn-primary' type='submit' value='Transfer' />
        </div>
      </form>
    </div>
  );
}

export default Transfer;
