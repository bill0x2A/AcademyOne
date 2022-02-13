import * as React from 'react';
import { CourseSummary } from '../../../types';
import { useNavigate } from 'react-router';
import {
    Box,
    Center,
    Image,
    Text,
    Heading,
    Stack,
    Avatar,
    useColorModeValue,
} from '@chakra-ui/react';
import styles from './Course.module.sass';

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
        maxW={'550px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
        onClick={navigateToCourseHomepage}
        className={styles.course}>
        <Box
            // h={'380px'}
            bg={'gray.100'}
            mt={-6}
            mx={-6}
            mb={6}
            pos={'relative'}>
            <Image
                src={imageURL}
                objectFit={'fill'}
            />
        </Box>
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
                color={useColorModeValue('gray.700', 'white')}
                fontSize={'2xl'}
                fontFamily={'body'}>
                {name}
            </Heading>
            <Text color={'gray.500'}>
                {description}
            </Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
            <Avatar
                src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
            />
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
                <Text fontWeight={600}>{author}</Text>
            </Stack>
        </Stack>
        </Box>
    </Center>
}

export default Course;
