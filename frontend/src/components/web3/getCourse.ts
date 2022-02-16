import CourseContractABI from '../../abis/CourseContract';
import { ethers } from 'ethers';

export const getCourse = (
    address: string,
    signerOrProvider?: ethers.providers.Web3Provider | ethers.Signer | undefined, // Ignore the undefined, TypeScript was being a shit 
): ethers.Contract => {
    return new ethers.Contract(address, CourseContractABI, signerOrProvider);
}

// Can only call hooks at top level of functional component, hence the need for this bs.