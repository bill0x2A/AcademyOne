import * as React from 'react';
import { CourseSummary } from '../../../types';
import { useNavigate } from 'react-router';
import Indenticon from '../../ui/Identicon';
import {
    Box,
    Center,
    Image,
    Text,
    Heading,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import styles from './Course.module.sass';
import Identicon from '../../ui/Identicon';

interface CourseProps {
    course: CourseSummary;
}

const Course: React.FC<CourseProps> = ({
    course,
}: CourseProps) => {
    const {
        imageURL,
        name,
        description,
        author,
        address,
    } = course;

    const navigate = useNavigate();

    const navigateToCourseHomepage = (): void => {
        navigate(`/courses/${address}`);
    }

    return <Center py={6}>
        <Box
            position='relative'
            top={'0px'}
            transition='all 200ms'
            maxW={'550px'}
            w={'full'}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
            onClick={navigateToCourseHomepage}
            className={styles.course}
            _hover={{
                top: '-4px',
            }}>
        <Box
            height='350px'
            backgroundImage={imageURL}
            backgroundSize='cover'
            pos={'relative'}>
        </Box>
        <Box bg={'secondary'} p={6} borderTop={'3px solid white'}>
        <Stack>
            <Text
                color={'green.500'}
                textTransform={'uppercase'}
                fontWeight={800}
                fontSize={'sm'}
                letterSpacing={1.1}>
            Course
            </Text>
            <Heading
                color={'white'}
                fontSize={'2xl'}
                fontFamily={'body'}>
                {name}
            </Heading>
            <Text color={'gray.200'}>
                {description}
            </Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
                <Indenticon className={styles.identicon} address={address} size={40}/>
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                <Text fontWeight={600}>{author}</Text>
            </Stack>
        </Stack>
        </Box>
        </Box>
    </Center>
}

export default Course;
