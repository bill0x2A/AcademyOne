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
import { useCourseContract } from '../../web3/useCourse'
import { useParams } from 'react-router';
import { CourseSummary, Module } from '../../../types';
import Enroll from '../../web3/Enroll';
import ModulePreview from './ModulePreview';

const CourseHomepage: React.FC = () => {

    const [courseSummary, setCourseSummary] = React.useState<CourseSummary>({
        name: '',
        description: '',
        imageURL: '',
        author: '',
        address: '',
    });
    const [modules, setModules] = React.useState<Module[]>([]);

    const { courseAddress } = useParams();
    const contract = useCourseContract(courseAddress || '0x0');

    const getCourseSummary = async (): Promise<void> => {
        const [
            name,
            description,
            imageURL,
            author
        ] = await contract.getSummaryInformation();
        setCourseSummary({
            name,
            description,
            imageURL,
            author,
            address: courseAddress || '0x0',
        });
    };

    const getModules = async (): Promise<void> => {
        const modulesToReturn: Module[] = []
        const [names, descriptions, materials, questions] = await contract.returnModules();
        for(let i=0; i < names.length; i++) {
            const module = {
                name: names[i],
                description: descriptions[i],
                materialsHash: materials[i],
                questionsHash: questions[i],
            }
            modulesToReturn.push(module);
        }
        setModules(modulesToReturn);
    };

    React.useEffect(() => {
        getCourseSummary();
        getModules();
    }, []);

    const {
        name,
        description,
        imageURL,
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
        <Heading>Modules</Heading>
        <hr/>
        {modules.map((module) => <ModulePreview module={module}/>)}
        <Enroll courseAddress={courseAddress || '0x0'}/>
    </Container>
}

export default CourseHomepage;
