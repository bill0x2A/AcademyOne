import CourseContractABI from '../../abis/CourseContract';
import { useSigner } from '../../context/Signer';
import { useProvider } from '../../context/Provider';
import { ethers } from 'ethers';

export const useCourseContract = (
    address: string,
): ethers.Contract => {
    const signer = useSigner();
    const provider = useProvider();
    return new ethers.Contract(address, CourseContractABI, signer || provider);
}