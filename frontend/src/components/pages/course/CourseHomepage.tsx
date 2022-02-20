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
import ModulePreview from './ModulePreview';
import RequestPreview from './RequestPreview';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { ethers } from 'ethers';
import { useAddress } from '../../../context/Address';
import { useCourseFactory } from '../../web3/useCourseFactoryContract';
import { FACTORY_ADDRESS } from '../../../constants/chain';
import { usePrevious } from '../../../hooks';

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
    const [isEnrolling, setIsEnrolling] = React.useState<boolean>(false);
    const [hasEnrolled, setHasEnrolled] = React.useState<boolean>(false);
    const wasEnrolling = usePrevious(isEnrolling);

    // Hooks
    const navigate = useNavigate();
    const { courseAddress } = useParams();
    const contract = useCourseContract(courseAddress || '0x0');
    const dadContract = useCourseFactory(FACTORY_ADDRESS);
    const address = useAddress();

    //Conditions


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

    const getModules = async (): Promise<void> => {
        const modulesToReturn: FrontendModule[] = []
        const [names, descriptions, materials, questions] = await contract.returnModules(selectedVersion);
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
            const [[name, description], author, approved, [bigTokens, bigApprovers, baseVersion]] = await contract.returnRequestSummary(i);
            pullRequestsToReturn.push({
                name,
                description,
                author,
                approved,
                index: i,
                tokens: bigTokens.toNumber(),
                approvers: bigApprovers.toNumber(), 
                baseVersion: baseVersion.toNumber(),
            });
        }
        setRequests(pullRequestsToReturn);
        setRequestsAreLoading(false);
    }

    const getLatestVersion = async (): Promise<void> => {
        const bigVersion: ethers.BigNumber = await contract.index();
        const version = bigVersion.toNumber();
        const possibleVersions = Array.from(Array(version).keys())
        setVersions(possibleVersions);
        setSelectedVersion(version - 1);
    };

    const selectVersionHandler = (e: any): void => {
        setSelectedVersion(e.target.value);
    };

    const submitPullRequestHandler = (): void => {
        navigate(`/courses/${courseAddress}/newrequest`);
    };

    const onEnrollHandler = async(): Promise<void> => {
        setIsEnrolling(true);
        const tx = await dadContract.joinCourse(courseAddress);
        setIsEnrolling(false);
    };

    const hasUserEnrolled = async(): Promise<void> => {
        const userCourses: string[] = await dadContract.returnEnrolledCourses();
        const ca = courseAddress || '';
        const userHasEnrolled: boolean = userCourses
            .map(uc => uc.toLowerCase())
            .includes(ca.toLowerCase());

        setHasEnrolled(userHasEnrolled);
    };  

    React.useEffect(() => {
        getCourseSummary();
        getLatestVersion();
        getPullRequests();
        hasUserEnrolled();
    }, []);

    React.useEffect(() => {
        if (selectedVersion !== undefined) getModules();
    }, [selectedVersion])

    React.useEffect(() => {
        if (!isEnrolling && wasEnrolling) setHasEnrolled(true);
    }, [isEnrolling, address]);

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
                <Text color='white' my={0}>Creator</Text>
                <UserDisplay address={author}/>
            </Stack>
            <Stack>
                <Text my={0}>Version</Text>
                <Select bg={'tertiary'} onChange={selectVersionHandler} value={selectedVersion}>
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
            mb={6}
            color='white'>
        </Box>
        <Text color='white' mb={10}>{description}</Text>
        <Heading color='white' mb={5}>Modules</Heading>
        <hr/>
        {modules.map((module) => <ModulePreview key={module.id} module={module}/>)}
        <Flex justifyContent='flex-end' mt={5}>
            { hasEnrolled
                ? <Stack>
                        <Flex border={'2px solid white'} px={5} py={2} bg={'green.600'} color='white'>You are enrolled on this course</Flex>
                        <Button

                            rightIcon={<AiOutlineDoubleRight/>}
                            onClick={() => navigate(`/courses/${courseAddress}/version/${selectedVersion}`)}>
                            Go to course
                        </Button>
                    </Stack>
                : <Button isLoading={isEnrolling} onClick={onEnrollHandler} colorScheme={'green'}>Enroll</Button>}
        </Flex>

        <Flex  mt={8} justifyContent={'space-between'} alignItems='center'>
            <Heading color='white' my={10}>Pull Requests</Heading>
            <Button color='white' bg='tertiary' ml={5} onClick={submitPullRequestHandler}>Submit Pull Request</Button>
        </Flex>
        <hr/>
        {requestsAreLoading
         ? <Center><Spinner size={'xl'}/></Center>
        : requests.map((request) => <RequestPreview key={`req-${request.index}`} request={request}/>)}
    </Container>
}

export default CourseHomepage;
