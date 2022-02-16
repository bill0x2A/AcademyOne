import CourseFactoryABI from '../../abis/ContractFactory';
import { useSigner } from '../../context/Signer';
import { useProvider } from '../../context/Provider';
import { ethers } from 'ethers';

export const useCourseFactory = (
    address: string,
): ethers.Contract => {
    const signer = useSigner();
    const provider = useProvider();
    return new ethers.Contract(address, CourseFactoryABI, signer || provider);
};