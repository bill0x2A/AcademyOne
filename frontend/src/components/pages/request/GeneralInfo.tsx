import * as React from 'react';
import {
    Box,
    Heading,
    Text,
} from '@chakra-ui/react';
import { PullRequest } from '../../../types';

interface GeneralInfoProps {
    requestSummary: PullRequest;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({
    requestSummary,
}: GeneralInfoProps) => {
    const {
        name,
        description,
        approvers,
        approved,
        tokens,
    } = requestSummary;
    return <Box mt={10} position='relative' p={5} pt='100px'>
        <Heading>{name}</Heading>
        <Box
            color={'white'}
            background={approved ? 'green:400' : 'orange.400'}
            border='2px solid white'
            py={3} 
            px={5} 
            position={'absolute'}
            top={'-2px'}
            left={'-2px'}>
            {approved ? 'Approved' : 'Open'}
        </Box>
        <Text>{description}</Text>
        <Text>{`${approvers} votes`}</Text>
        <Text>{`${tokens}/1000 requested share`}</Text>
    </Box>
};

export default GeneralInfo;
