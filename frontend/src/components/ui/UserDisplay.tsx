import * as React from 'react';
import Identicon from 'react-identicons';
import {
    Box,
    Text,
} from '@chakra-ui/react';
import styles from './UserDisplay.module.sass';

interface UserDisplayProps {
    address: string,
}

const UserDisplay: React.FC<UserDisplayProps> = ({
    address,
}: UserDisplayProps) => {
    const displayAddress = `${address.substring(0,4)}...${address.substring(address.length - 4)}`
    return <Box className={styles.container} border={'2px'} mt={0}>
        <Text>{displayAddress}</Text>
        <Identicon className={styles.identicon} string={address} size={40}/>
    </Box>
}

export default UserDisplay;
