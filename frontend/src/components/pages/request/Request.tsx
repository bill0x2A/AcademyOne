import * as React from 'react';
import {
    Container,
    Heading,
    Center,
    Spinner,
    Box,
    Button,
    Flex,
    Text,
} from '@chakra-ui/react';
import ModuleView from '../../ui/ModuleView';
import { v4 as uuid } from 'uuid';
import { useCourseContract } from '../../web3/useCourse';
import { useParams } from 'react-router';
import { FrontendModule, PullRequest } from '../../../types';
import { getTextFromIPFS } from '../../../helpers';
import GeneralInfo from './GeneralInfo';
import { useAddress } from '../../../context/Address';
import { usePrevious } from '../../../hooks';

const Request: React.FC = () => {

    //Hooks
    const { courseAddress, requestIndex } = useParams();
    const contract = useCourseContract(courseAddress ||  '0x0');
    const address = useAddress();

    //State
    const [requestSummary, setRequestSummary] = React.useState<PullRequest>();
    const [request, setRequest] = React.useState<FrontendModule[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isApproving, setIsApproving] = React.useState<boolean>(false);
    const [isMaintainer, setIsMainatiner] = React.useState<boolean>(false);
    const [maintainerHasApproved, setMaintainerHasApproved] = React.useState<boolean>(false);
    const wasApproving = usePrevious(isApproving);

    //Conditions
    const approvalSuccess = !isApproving && wasApproving;

    //Methods
    const getRequestSummary = async() => {
        const [[name, description], author, approved, [bigTokens, bigApprovers, baseVersion]] = await contract.returnRequestSummary(requestIndex);
        const req: PullRequest = {
            name,
            description,
            author,
            approved,
            index: Number(requestIndex),
            tokens: bigTokens.toNumber(),
            approvers: bigApprovers.toNumber(), 
            baseVersion: baseVersion.toNumber(),
        };
        setRequestSummary(req);
    };

    const getRequest = async() => { 
        const modulesToReturn: FrontendModule[] = [];
        const [moduleNames, moduleDescs, moduleMaterials, moduleQuestions] = await contract.returnRequestModules(requestIndex);
        for(let i=0; i<moduleNames.length; i++){
            const mats = await getTextFromIPFS(moduleMaterials[i]);
            const qs = await getTextFromIPFS(moduleQuestions[i]);
            const module: FrontendModule = {
                id: uuid(),
                name: moduleNames[i],
                description: moduleDescs[i],
                materials: mats,
                questions: qs,
            }
            modulesToReturn.push(module);
        };
        setRequest(modulesToReturn);
        setLoading(false);
    };

    const checkIsMaintainer = async(): Promise<void> => {
        const soAreTheyAFuckingMaintainerOrNot = await contract.maintainers(address);
        const orAManager = await contract.manager();
        setIsMainatiner(soAreTheyAFuckingMaintainerOrNot || orAManager);
    };

    const approveRequest = async(): Promise<void> => {
        setIsApproving(true);
        try {
            const tx = await contract.voteRequest(requestIndex);
            setIsApproving(false);
        } catch(e) {
            console.log(e);
        }
    }

    const checkMaintainerHasApproved = async() => {
        const hasApproved = await contract.maintainerVotes(requestIndex, address);
        setMaintainerHasApproved(hasApproved);
    }

    //Effects
    React.useEffect (() => {
        getRequestSummary();
        getRequest();
        checkIsMaintainer();
        checkMaintainerHasApproved();
    }, []);

    React.useEffect(() => {
        if (!!requestSummary) getRequest();
    }, [requestSummary]);

    React.useEffect(() => {
        getRequestSummary();
    }, [approvalSuccess]);

    return <Container mt={'50px'} maxW='1280px' pb={'100px'}>
        <Flex justifyContent={'space-between'}>
            <Heading>Course Pull Request</Heading>
            {isMaintainer && !maintainerHasApproved && <Button isLoading={isApproving} onClick={approveRequest} colorScheme='green'>Vote to Request</Button>}
            {(approvalSuccess || maintainerHasApproved) && <Flex p={3} px={5} border={'2px solid white'} bg={'green.400'}>
                <Text color={'white'}>Vote approved</Text>
            </Flex>}
        </Flex>
        { !loading && requestSummary && request.length > 0
            ? <>
                <GeneralInfo requestSummary={requestSummary}/>
                <Heading fontSize={25}>Modules</Heading>
                {request.map((module) => <ModuleView module={module}/>)}
            </>
            : <Center><Spinner size='xl'/></Center>}
    </Container>
};

export default Request;
