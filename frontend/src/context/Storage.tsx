import * as React from 'react';
import type { Web3Storage } from 'web3.storage';

export const StorageContext = React.createContext<Web3Storage | undefined>(undefined);

interface StorageProviderProps {
    children: React.ReactNode;
    value?: Web3Storage;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({
    value,
    children,
}: StorageProviderProps) => (
    <StorageContext.Provider value={value}>
        {children}
    </StorageContext.Provider>
);

export const useStorage = () => React.useContext(StorageContext);
