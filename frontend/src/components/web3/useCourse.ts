import CourseContractABI from '../../artifacts/CourseContract';
import { useSigner } from '../../context/Signer';
import { useProvider } from '../../context/Provider';
import { ethers } from 'ethers';

export const useCourseContract = (
    address: string,
) => {
    const signer = useSigner();
    const provider = useProvider();
    return null; // new ethers.Contract(address, CourseContractABI, signer || provider);
}