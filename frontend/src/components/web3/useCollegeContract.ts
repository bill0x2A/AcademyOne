import CourseFactoryABI from '../../artifacts/CourseFactory';
import { useSigner } from '../../context/Signer';
import { useProvider } from '../../context/Provider';
import { ethers } from 'ethers';

export const useCourseFactory = (
    address: string,
) => {
    const signer = useSigner();
    const provider = useProvider();
    return new ethers.Contract(address, CollegeContractABI, signer || provider);
}