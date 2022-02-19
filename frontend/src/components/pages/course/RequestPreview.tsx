import * as React from 'react';
import {
    Box,
    Text,
    Flex,
    Stack,
    Button,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router';
import UserDisplay from '../../ui/UserDisplay';
import { PullRequest } from '../../../types';

interface RequestPreviewProps {
    request: PullRequest;
}

const RequestPreview: React.FC<RequestPreviewProps> = ({
    request,
}: RequestPreviewProps) => {
    const navigate = useNavigate();
    const { courseAddress } = useParams();

    const viewPRHandler = (): void => {
        navigate(`/courses/${courseAddress}/requests/${request.index}`)
    };

    const {
        index,
        name,
        description,
        author,
        approved,
        tokens,
        approvers,
    } = request;
    return <Box position={'relative'} my={5} border='2px solid white' p={3} pt='55px' borderRadius={'5px'}>
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
        <Stack position='absolute' top={'2px'} right={'5px'}>
                <Text mb={0}>Author</Text>
                <UserDisplay address={author}/>
            </Stack>
        <Flex justifyContent={'space-between'}>
            <Text fontSize={25}>{name}</Text>
        </Flex>
        <Text>{description}</Text>
        <Flex justifyContent='space-between' alignItems={'flex-end'} width='100%'>
            <Box  mt={5} border={'2px solid white'}>
                <Stack py={1} px={3}>
                    <Text  mb={0}>{`${approvers} votes`}</Text>
                </Stack>
            </Box>
            <Button onClick={viewPRHandler}>View</Button>
        </Flex>
    </Box>
}

export default RequestPreview;