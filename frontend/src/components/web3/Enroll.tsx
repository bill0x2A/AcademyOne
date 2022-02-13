import * as React from 'react';
import ethers from 'ethers';
import { useSigner } from '../../context/Signer';
import {
    Button,
} from '@chakra-ui/react';

interface EnrollProps {
    courseAddress: string;
    className?: string;
}

const Enroll: React.FC<EnrollProps> = ({
    courseAddress,
    className,
}: EnrollProps) => {

    const signer = useSigner();
    const [loading, setLoading] = React.useState<boolean>(false);

    const onEnroll = async(): Promise<void> => {
        console.log('Enrolling student')
        setLoading(true);
    }

    const connectWallet = (): void => {
        console.log('Connecting wallet');
        setLoading(true);
    }

    // We need to create the ethers contract object here as the address it is
    // initialized with will vary for every course

    // const contract = new ethers.Contract(courseABI, courseAddress);
    /// etc...

    return <Button
        onClick={signer ? onEnroll : connectWallet}
        isLoading={loading}
        className={className}
        colorScheme={'green'}>
        {signer ? 'Enroll' : 'Connect Wallet'}
    </Button>
}

export default Enroll;