import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router';
import { useSigner } from '../../../context/Signer';
import { useCourseFactory } from '../../web3/useCourseFactoryContract';
import { usePrevious } from '../../../hooks';
import {
    Container,
    Heading,
    Button,
    Flex,
    Text,
} from '@chakra-ui/react';
import GeneralInformation from './GeneralInformation';
import AddModules from './AddModules';
import { FrontendModule, MarkdownData } from '../../../types';
import { create } from 'ipfs-http-client'
import 'react-markdown-editor-lite/lib/index.css';
import { FACTORY_ADDRESS } from '../../../constants/chain';

const client = create({url: 'https://ipfs.infura.io:5001/api/v0'});

const Create: React.FC = () => {

    const [title, setTitle] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();
    const [imageURL, setImageURL] = React.useState<string>();
    const [stage, setStage] = React.useState<number>(0);
    const [isCreating, setIsCreating] = React.useState<boolean>(false);
    const wasCreating = usePrevious(isCreating);
    const contract = useCourseFactory(FACTORY_ADDRESS);

    const shouldAllowNavigationToStage2 = stage === 0 && ((!!description && !!title && !!imageURL) || true); // TEMP! REMOVE ME!
    const shouldShowBackButton = stage > 0;
    const creationSucessful = wasCreating && !isCreating;
    const shouldShowCreateButton = stage === 1 && !creationSucessful;

    const navigate = useNavigate();
    const signer = useSigner();

    // If there is no signer the user has not connected their wallet
    // Redirect them to the homepage if this is the case
    React.useEffect(() => {
        if (!signer) {
            navigate('/');
        }
    }, [signer, navigate]);

    const newUploadMarkdownData = async (text: string): Promise<string> => {
        const file = new File([text], 'text.md');
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log(url);
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
            const materialsURL = await newUploadMarkdownData(module.materials);
            const questionsURL = await newUploadMarkdownData(module.questions);
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
        materials: '',
        questions: '',
    },]);

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
        const moduleIndexToDelete = getModuleIndex(id);
        setModules((modules) => ([...modules].splice(moduleIndexToDelete, 1)));
    };

    const createCourse = async () => {
        setIsCreating(true);
        const {
            names,
            descriptions,
            materials,
            questions,
        } = await processModuleData();
        const tx = await contract.createCourse(
            title,
            description,
            imageURL,
            names,
            descriptions,
            materials,
            questions,
        );
        console.log(tx);
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
                {creationSucessful && <Text color={'green.500'}>Success!!! (I think)</Text>}
            </Flex>
    </Container>;
}

export default Create;