import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router';
import { useSigner } from '../../../context/Signer';
import { useAddress } from '../../../context/Address';
import { usePrevious } from '../../../hooks';
import {
    Container,
    Heading,
    Button,
    Flex,
} from '@chakra-ui/react';
import GeneralInformation from './GeneralInformation';
import AddModules from './AddModules';
import StorageClient from '../../web3/StorageClient';
import { FrontendModule, MarkdownData } from '../../../types';
import 'react-markdown-editor-lite/lib/index.css';


const Create: React.FC = () => {

    const [title, setTitle] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();
    const [imageURL, setImageURL] = React.useState<string>();
    const [stage, setStage] = React.useState<number>(0);
    const [isCreating, setIsCreating] = React.useState<boolean>(false);
    const wasCreating = usePrevious(isCreating);
    const address = useAddress();

    const shouldAllowNavigationToStage2 = stage === 0 && ((!!description && !!title && !!imageURL) || true); // TEMP! REMOVE ME!
    const shouldShowBackButton = stage > 0;
    const creationSucessfull = wasCreating && !isCreating;
    const shouldShowCreateButton = stage === 1 && !wasCreating;

    const navigate = useNavigate();
    const signer = useSigner();

    // If there is no signer the user has not connected their wallet
    // Redirect them to the homepage if this is the case
    React.useEffect(() => {
        if (!signer) {
            navigate('/');
        }
    }, [signer, navigate]);

    const uploadMarkdownData = async (text: string): Promise<string> => {
        console.log('Uploading')
        const file = new File([text], 'text.md');
        console.log(file);
        const url = await new StorageClient().storeFiles(file);
        console.log(url);
        return url;
    }

    const processModuleData = async () => {
        let names: string[] = [];
        let descriptions: string[] = [];
        let materials: string[] = [];
        let questions: string[] = [];

        modules.forEach(async (module) => {
            names.push(module.name);
            descriptions.push(module.description);
            const materialsURL = await uploadMarkdownData(module.materials.text);
            const questionsURL = await uploadMarkdownData(module.questions.text);
            materials.push(materialsURL);
            questions.push(questionsURL);
        });
        return({names, description, materials, questions});
    }

    const getModuleIndex = (id: string): number => {
        let moduleIndex = 0;
        modules.forEach((module, index) => {
            if (module.id === id) moduleIndex = index;
        })
        return moduleIndex;
    };

    const handleSetTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const [modules, setModules] = React.useState<FrontendModule[]>([{
        id: uuid(),
        name: '',
        description: '',
        author: address || '',
        materials: '',
        questions: '',
    },]);

    const addNewModule = (): void => {
        const newModule: FrontendModule = {
            id: uuid(),
            name: '',
            description: '',
            author: address || '',
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
        newModules[index].materials = data;
        setModules(newModules);
    };

    const handleQuestionsDataChange = (index: number, data: MarkdownData) => {
        const newModules = [...modules];
        newModules[index].questions = data;
        setModules(newModules);
    };

    const deleteModuleHandler = (id: string): void => {
        // This is broken af if done with index so we use a uuid instead
        const moduleIndexToDelete = getModuleIndex(id);
        setModules((modules) => ([...modules].splice(moduleIndexToDelete, 1)));
    };

    const createCourse = async () => {
        setIsCreating(true);
        const data = await processModuleData();
        // Contract interaction
        setIsCreating(false);
    }

    let subpage;

    switch(stage) {
        case 0:
            subpage = <GeneralInformation
                title={title}
                description={description}
                imageURL={imageURL}
                handleSetTitle={handleSetTitle}
                handleSetDescription={handleSetDescription}
                handleSetImageURL={setImageURL}/>;
            break;
        case 1:
            subpage = <AddModules
                modules={modules}
                addNewModule={addNewModule}
                handleNameChange={handleNameChange}
                handleDescriptionChange={handleDescriptionChange}
                handleMaterialsDataChange={handleMaterialsDataChange}
                handleQuestionsDataChange={handleQuestionsDataChange}
                deleteModuleHandler={deleteModuleHandler}/>
            break;
    }

    return <Container maxW={'1280px'} pb={20}>
            <Heading my={6}>Create a new course</Heading>
            <br/>
            {subpage}
            <br/>
            <Flex justifyContent='space-between'>
                {shouldAllowNavigationToStage2 && <Button
                    alignSelf={'flex-end'}
                    colorScheme={'purple'}
                    onClick={() => setStage(1)}>
                    Next</Button>}
                {shouldShowBackButton && <Button
                    colorScheme={'red'}
                    onClick={() => setStage((stage) => stage - 1)}>
                    Back</Button>}
                {shouldShowCreateButton && <Button
                    isLoading={isCreating}
                    onClick={createCourse}
                    colorScheme={'green'}
                    >Create</Button>}
            </Flex>
    </Container>;
}

export default Create;