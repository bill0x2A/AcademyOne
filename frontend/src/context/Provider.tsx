import * as React from 'react';
import type { ethers } from 'ethers';

export const ProviderContext = React.createContext<ethers.providers.Web3Provider | undefined>(undefined);

interface ProviderProviderProps {
    children: React.ReactNode;
    value?: ethers.providers.Web3Provider;
}

export const ProviderProvider: React.FC<ProviderProviderProps> = (props: ProviderProviderProps) => (
    <ProviderContext.Provider value={props.value}>
        {props.children}
    </ProviderContext.Provider>
);

export const useProvider = () => React.useContext(ProviderContext);
