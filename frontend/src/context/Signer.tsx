import * as React from 'react';
import type { ethers } from 'ethers';

export const SignerContext = React.createContext<ethers.Signer | undefined>(undefined);

interface SignerProviderProps {
    children: React.ReactNode;
    value?: ethers.Signer;
}

export const SignerProvider: React.FC<SignerProviderProps> = ({
    value,
    children,
}: SignerProviderProps) => (
    <SignerContext.Provider value={value}>
        {children}
    </SignerContext.Provider>
);

export const useSigner = () => React.useContext(SignerContext);
