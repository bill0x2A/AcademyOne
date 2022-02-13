import * as React from 'react';
import {
    Container,
    Heading,
    Text,
    Image,
    Stack,
    Flex,
    Box,
} from '@chakra-ui/react';
import UserDisplay from '../../ui/UserDisplay';
import { CourseSummary } from '../../../types';
import Enroll from '../../web3/Enroll';

interface CourseHomepageProps {
    courseSummary?: CourseSummary;
}

const fakeCourse = {
    imageURL: 'https://i0.wp.com/www.garage-bar.co.uk/wp-content/uploads/Carling-Beer-Interlocking-Pint-Glass.jpg',
    name: 'Drinking wee',
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti, quis tempore dolores odio perferendis libero soluta quibusdam. Sequi, sit.',
    author: '0x829y1nd028ha029pjcp9wcjpjwc',
    address: '0xoihawfihw',
};

const CourseHomepage: React.FC<CourseHomepageProps> = ({
    courseSummary = fakeCourse,
}: CourseHomepageProps) => {
    const {
        name,
        description,
        imageURL,
        address,
        author,
    } = courseSummary;
    return <Container maxW={'1280px'} pb={20}>
        <Flex justifyContent={'space-between'} py={8}>
            <Heading>{name}</Heading>
            <Stack>
                <Text my={0}>Creator</Text>
                <UserDisplay address={author}/>
            </Stack>
        </Flex>
        <Box boxSize={'xl'} background={'azure'} width={'100%'} overflow={'hidden'} mb={6}>
            <Image src={imageURL} objectFit={'fill'}/>
        </Box>
        <Text mb={10}>{description}</Text>
        <Enroll courseAddress={address}/>
    </Container>
}

export default CourseHomepage;
