import { MetaMaskInpageProvider } from '@metamask/providers';

export interface RPCErrorType {
    code: string | number;
    message: string;
    data?: {
        message: string;
    };
}

export interface CourseSummary {
    imageURL: string;
    name: string;
    description: string;
    author: string;
    address: string;
}

export interface CustomWindow extends Window {
    ethereum: MetaMaskInpageProvider;
}