import * as React from 'react';
import {
    Box,
} from '@chakra-ui/react';
import IdenticonImage from 'react-identicons';

interface IdenticonProps {
    address: string;
    size: number;
    className?: string;
}

const Identicon: React.FC<IdenticonProps> = ({
    address,
    size,
    className,
}: IdenticonProps) => {
    return <Box
        className={className}
        width={`${size}px`}
        height={`${size}px`}
        overflow={'hidden'}
        borderRadius={'100%'}>
        <IdenticonImage string={address} size={size}/>
    </Box>
}

export default Identicon;
