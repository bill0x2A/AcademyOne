import * as React from 'react';
import type { ethers } from 'ethers';

export const ContractContext = React.createContext<ethers.Contract | undefined>(undefined);

interface ContractProviderProps {
    children: React.ReactNode;
    value?: ethers.Contract;
}

export const ContractProvider: React.FC<ContractProviderProps> = (props: ContractProviderProps) => (
    <ContractContext.Provider value={props.value}>
        {props.children}
    </ContractContext.Provider>
);

export const useContract = () => React.useContext(ContractContext);
