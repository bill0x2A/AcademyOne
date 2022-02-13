import { MetaMaskInpageProvider } from '@metamask/providers';

export interface RPCErrorType {
    code: string | number;
    message: string;
    data?: {
        message: string;
    };
}

export interface CustomWindow extends Window {
    ethereum: MetaMaskInpageProvider;
}