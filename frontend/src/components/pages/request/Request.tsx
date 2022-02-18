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
    const [request, setRequest] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [isApproving, setIsApproving] = React.useState<boolean>(false);
    const [isMaintainer, setIsMainatiner] = React.useState<boolean>(false);
    const [maintainerHasApproved, setMaintainerHasApproved] = React.useState<boolean>(false);
    const wasApproving = usePrevious(isApproving);

    //Conditions
    const approvalSuccess = !isApproving && wasApproving;

    //Methods
    const getRequestSummary = async() => {
        const [[name, description], author, approved, [bigTokens, bigApprovers]] = await contract.returnRequestTokens(requestIndex);
        const req: PullRequest = {
            name,
            description,
            author,
            approved,
            index: Number(requestIndex),
            tokens: bigTokens.toNumber(),
            approvers: bigApprovers.toNumber(), 
        };
        setRequestSummary(req);
    };

    const getRequest = async() => { 
        const modulesToReturn: FrontendModule[] = [];
        const [moduleNames, moduleDescs, moduleMaterials, moduleQuestions] = await contract.returnRequest(requestIndex);
        for(let i=0; i<moduleNames.lenght; i++){
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

    return <Container mt={5} maxW='1280px'>
        <Flex justifyContent={'space-between'}>
            <Heading>Request</Heading>
            {isMaintainer && !maintainerHasApproved && <Button onClick={approveRequest} colorScheme='green'>Vote to Request</Button>}
            {(approvalSuccess || maintainerHasApproved)&& <Text colorScheme={'green'}>Vote approved</Text>}
        </Flex>
        { !loading && requestSummary
            ? <GeneralInfo requestSummary={requestSummary}/>
            : <Center><Spinner size='xl'/></Center>}
    </Container>
};

export default Request;
