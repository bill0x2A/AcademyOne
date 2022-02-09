import * as React from 'react';

export const AddressContext = React.createContext<string | undefined>(undefined);

interface AddressProviderProps {
    children: React.ReactNode;
    value?: string;
}

export const AddressProvider: React.FC<AddressProviderProps> = ({
    children, 
    value,
}: AddressProviderProps) => (
    <AddressContext.Provider value={value}>
        {children}
    </AddressContext.Provider>
);

export const useAddress = () => React.useContext(AddressContext);
