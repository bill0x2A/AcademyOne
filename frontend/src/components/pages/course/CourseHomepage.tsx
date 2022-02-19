import * as React from 'react';
import {
    Container,
    Heading,
    Text,
    Button,
    Stack,
    Flex,
    Box,
    Select,
    Center,
    Spinner,
} from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import UserDisplay from '../../ui/UserDisplay';
import { useCourseContract } from '../../web3/useCourse'
import { useNavigate, useParams } from 'react-router';
import { CourseSummary, FrontendModule, PullRequest } from '../../../types';
import Enroll from '../../web3/Enroll';
import ModulePreview from './ModulePreview';
import RequestPreview from './RequestPreview';

const CourseHomepage: React.FC = () => {

    // State
    const [courseSummary, setCourseSummary] = React.useState<CourseSummary>({
        name: '',
        description: '',
        imageURL: '',
        author: '',
        address: '',
    });
    const [modules, setModules] = React.useState<FrontendModule[]>([]);
    const[versions, setVersions] = React.useState<number[]>([]);
    const [selectedVersion, setSelectedVersion] = React.useState<number>();
    const [requests, setRequests] = React.useState<PullRequest[]>([]);
    const [requestsAreLoading, setRequestsAreLoading] = React.useState<boolean>(true);

    // Hooks
    const navigate = useNavigate();
    const { courseAddress } = useParams();
    const contract = useCourseContract(courseAddress || '0x0');

    // Methods
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

    const getModules = async (version: number): Promise<void> => {
        const modulesToReturn: FrontendModule[] = []
        const [names, descriptions, materials, questions] = await contract.returnModules(0);
        for(let i=0; i < names.length; i++) {
            const module = {
                id: uuid(),
                name: names[i] as string,
                description: descriptions[i] as string,
                materials: materials[i] as string,
                questions: questions[i] as string,
            }
            modulesToReturn.push(module);
        }
        setModules(modulesToReturn);
    };

    const getPullRequests = async(): Promise<void> => {
        const pullRequestsToReturn: PullRequest[] = [];
        const numberOfRequests = await contract.requestIndex();
        for(let i=0; i<numberOfRequests; i++) {
            const [[name, description], author, approved, [bigTokens, bigApprovers]] = await contract.returnRequestTokens(i);
            pullRequestsToReturn.push({
                name,
                description,
                author,
                approved,
                index: i,
                tokens: bigTokens.toNumber(),
                approvers: bigApprovers.toNumber(), 
            });
        }
        setRequests(pullRequestsToReturn);
        setRequestsAreLoading(false);
    }

    const getLatestVersion = async (): Promise<void> => {
        const version: number = await contract.index();
        const possibleVersions = Array.from(Array(version + 1).keys())
        setVersions(possibleVersions);
        setSelectedVersion(version);
    };

    const selectVersionHandler = (e: any): void => {
        setSelectedVersion(e.target.value);
    }

    const submitPullRequestHandler = (): void => {
        navigate(`/courses/${courseAddress}/newrequest`);
    };

    React.useEffect(() => {
        getCourseSummary();
        getLatestVersion();
        getPullRequests();
    }, []);

    React.useEffect(() => {
        if (!!selectedVersion) getModules(selectedVersion);
    }, [selectedVersion])

    const {
        name,
        description,
        imageURL,
        author,
    } = courseSummary;

    return <Container maxW={'1280px'} pb={20}>
        <Flex justifyContent={'space-between'} py={8}>
            <Heading color='white'>{name}</Heading>
            <Stack>
                <Text my={0}>Creator</Text>
                <UserDisplay address={author}/>
            </Stack>
            <Stack>
                    <Text my={0}>Version</Text>
            <Select onChange={selectVersionHandler}>
                    {versions.map((version) => <option value={version}>{version}</option>)}
                </Select>
            </Stack>
        </Flex>
        <Box
            backgroundImage={imageURL}
            borderRadius={'5px'}
            backgroundSize='cover'
            boxSize={'xl'}
            width={'100%'}
            overflow={'hidden'}
            mb={6}>
        </Box>
        <Text mb={10}>{description}</Text>
        <Heading mb={5}>Modules</Heading>
        <hr/>
        {modules.map((module) => <ModulePreview key={module.id} module={module}/>)}
        <Flex justifyContent='flex-end'>
            <Enroll courseAddress={courseAddress || '0x0'}/>
        </Flex>

        <Flex  mt={8} justifyContent={'space-between'} alignItems='center'>
            <Heading my={10}>Pull Requests</Heading>
            <Button bg='tertiary' ml={5} onClick={submitPullRequestHandler}>Submit Pull Request</Button>
        </Flex>
        <hr/>
        {requestsAreLoading
         ? <Center><Spinner size={'xl'}/></Center>
        : requests.map((request) => <RequestPreview key={`req-${request.index}`} request={request}/>)}
    </Container>
}

export default CourseHomepage;
