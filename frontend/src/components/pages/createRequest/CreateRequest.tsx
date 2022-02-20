import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate, useParams } from 'react-router';
import { useSigner } from '../../../context/Signer';
import { usePrevious } from '../../../hooks';
import {
    Container,
    Box,
    Heading,
    Button,
    Flex,
    Text,
    Input,
    Spinner,
    Center,
    Select,
    Stack,
    FormLabel,
} from '@chakra-ui/react';
import { getTextFromIPFS } from '../../../helpers';
import AddModules from '../create/AddModules';
import { FrontendModule, MarkdownData } from '../../../types';
import { create } from 'ipfs-http-client'
import 'react-markdown-editor-lite/lib/index.css';
import { useCourseContract } from '../../web3/useCourse';
import { ethers } from 'ethers';

const client = create({url: 'https://ipfs.infura.io:5001/api/v0'});

const CreateRequest: React.FC = () => {
    // State
    const [title, setTitle] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();
    const [tokens, setTokens] = React.useState<number>();
    const [isCreating, setIsCreating] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [versions, setVersions] = React.useState<number[]>([]);
    const [selectedVersion, setSelectedVersion] = React.useState<number>();
    const [modules, setModules] = React.useState<FrontendModule[]>([]);

    // Hooks
    const wasCreating = usePrevious(isCreating);
    const { courseAddress } = useParams();
    const contract = useCourseContract(courseAddress || '0x0');
    const navigate = useNavigate();
    const signer = useSigner();

    // Conditions
    const creationSucessful = wasCreating && !isCreating;
    const shouldShowCreateButton = !creationSucessful;

    // If there is no signer the user has not connected their wallet
    // Redirect them to the homepage if this is the case
    React.useEffect(() => {
        if (!signer) {
            navigate('/');
        }
    }, [signer, navigate]);

    const uploadMarkdownData = async (text: string): Promise<string> => {
        const file = new File([text], 'text.md');
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            return url;
          } catch (error) {
            console.log('Error uploading file: ', error)
          } 
        return '';
    }

    const processModuleData = async () => {
        let names: string[] = [];
        let descriptions: string[] = [];
        let materials: string[] = [];
        let questions: string[] = [];
        for(const module of modules) {
            names.push(module.name);
            descriptions.push(module.description);
            const materialsURL = await uploadMarkdownData(module.materials);
            const questionsURL = await uploadMarkdownData(module.questions);
            materials.push(materialsURL);
            questions.push(questionsURL);
        }
        return({names, descriptions, materials, questions});
    }

    const getModuleIndex = (id: string): number => {
        let moduleIndex = 0;
        modules.forEach((module, index) => {
            if (module.id === id) moduleIndex = index;
        })
        return moduleIndex;
    };

    const addNewModule = (): void => {
        const newModule: FrontendModule = {
            id: uuid(),
            name: '',
            description: '',
            materials: '',
            questions: '',
        };
        setModules([...modules, newModule]);
    };

    const handleNameChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newModules = [...modules];
        newModules[index].name = event.target.value;
        setModules(newModules);
    };

    const handleDescriptionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newModules = [...modules];
        newModules[index].description = event.target.value;
        setModules(newModules);
    };

    const handleMaterialsDataChange = (index: number, data: MarkdownData) => {
        const newModules = [...modules];
        newModules[index].materials = data.text;
        setModules(newModules);
    };

    const handleQuestionsDataChange = (index: number, data: MarkdownData) => {
        const newModules = [...modules];
        newModules[index].questions = data.text;
        setModules(newModules);
    };

    const deleteModuleHandler = (id: string): void => {
        // This is broken af if done with index so we use a uuid instead
        const newModules = [...modules].filter((module) => module.id !== id);
        setModules(newModules);
    };

    const getModules = async (version: number): Promise<void> => {
        const modulesToReturn: FrontendModule[] = []
        const returnedModules = await contract.returnModules(version - 1);
        const [names, descriptions, materials, questions] = returnedModules;
        for(let i=0; i < names.length; i++) {
            const materialsText: string = await getTextFromIPFS(materials[i]);
            const questionsText: string = await getTextFromIPFS(questions[i]);
            const module = {
                id: uuid(),
                name: names[i],
                description: descriptions[i],
                materials: materialsText,
                questions: questionsText,
            }
            modulesToReturn.push(module);
        }
        setModules(modulesToReturn);
        setIsLoading(false);
    };

    const getLatestVersion = async (): Promise<void> => {
        const version: ethers.BigNumber = await contract.index();
        const versionInt = version.toNumber();
        const possibleVersions = Array.from(Array(versionInt).keys());
        setSelectedVersion(versionInt);
        setVersions(possibleVersions);
    };

    const createRequestHandler = async (): Promise<void> => {
        setIsCreating(true);
        const {
            names,
            descriptions,
            materials,
            questions,
        } = await processModuleData();
        const tx = await contract.createRequest(
            title,
            description,
            tokens,
            names,
            descriptions,
            materials,
            questions,
            selectedVersion,
        )
        setIsCreating(false);
    };

    const onChangeTitleHandler = (e: any): void => {
        setTitle(e.target.value);
    }

    const onChangeDescriptionHandler = (e: any): void => {
        setDescription(e.target.value);
    }

    const onChangeTokensHandler = (e: any): void => {
        setTokens(e.target.value);
    }

    const selectVersionHandler = (e: any): void => {
        setIsLoading(true);
        setSelectedVersion(e.target.value);
    }

    React.useEffect(() => {
        getLatestVersion();
    }, [])

    React.useEffect(() => {
        if (!!selectedVersion) getModules(selectedVersion);
    }, [selectedVersion])

    return <Container maxW={'1280px'} pb={20}>
            <Heading my={6}>Create a pull request</Heading>
            <Box borderTop={'2px solid white'} width={'100%'} height={'20px'}/>
            <Stack mb={5} >
                    <Text my={0}> Base Version</Text>
                <Select  color={'black'} bg={'white'} onChange={selectVersionHandler}>
                    {versions.map((version) => <option key={version} value={version}>{version}</option>)}
                </Select>
            </Stack>
            {isLoading
                ? <Center minHeight={'calc(100vh - 200px)'}><Spinner size={'xl'}/></Center>
                : <>
                    <FormLabel>PR Title</FormLabel>
                    <Input color='black'bg={'white'} mb={5} value={title} onChange={onChangeTitleHandler}/>
                    <FormLabel>Description of changes</FormLabel>
                    <Input  color='black'bg={'white'} mb={5}  value={description} onChange={onChangeDescriptionHandler}/>
                    <FormLabel>Requested course shares (out of 1000 total)</FormLabel>
                    <Input  color='black' bg={'white'} type='number' max={1000} mb={5} value={tokens} onChange={onChangeTokensHandler}/>
                    <Box borderTop={'2px solid white'} mt={20} width={'100%'} height={'20px'}/>
                    <AddModules
                        modules={modules}
                        addNewModule={addNewModule}
                        handleNameChange={handleNameChange}
                        handleDescriptionChange={handleDescriptionChange}
                        handleMaterialsDataChange={handleMaterialsDataChange}
                        handleQuestionsDataChange={handleQuestionsDataChange}
                        deleteModuleHandler={deleteModuleHandler}/>
                    <Flex justifyContent='space-between'>
                        {shouldShowCreateButton && <Button
                            isLoading={isCreating}
                            onClick={createRequestHandler}
                            colorScheme={'green'}
                            >Submit Request</Button>}
                        {creationSucessful && <Text color={'green.500'}>Success!!! (I think)</Text>}
                    </Flex>
                </>}
    </Container>;
}

export default CreateRequest;