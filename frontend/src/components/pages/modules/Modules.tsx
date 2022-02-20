import {
    Container,
    Flex,
    Button,
    Center,
    Spinner,
} from '@chakra-ui/react';
import * as React from 'react';
import { useParams } from 'react-router';
import { getTextFromIPFS } from '../../../helpers';
import { v4 as uuid } from 'uuid';
import { FrontendModule } from '../../../types';
import { useCourseContract } from '../../web3/useCourse';
import ModuleView from '../../ui/ModuleView';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';


const Module: React.FC = () => {
    //State
    const [selectedModule, setSelectedModule] = React.useState<number>(0);
    const [modules, setModules] = React.useState<FrontendModule[]>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    //Hooks
    const { courseAddress, courseVersion } = useParams();
    const contract = useCourseContract(courseAddress || '0x0');

    //Methods
    const getModules = async (): Promise<void> => {
        const modulesToReturn: FrontendModule[] = []
        const returnedModules = await contract.returnModules((courseVersion as any  || 0));
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

    const nextModuleHandler = () => {
        if (modules && modules[selectedModule + 1]) setSelectedModule(selectedModule + 1);
    }

    const prevModuleHandler = () => {
        if (selectedModule === 0) return;
        setSelectedModule(selectedModule - 1);
    }

    //Effects
    React.useEffect(() => {
        getModules();
    }, []);

    return <Container maxW={'1280px'}>
        <Flex mt={10} justifyContent={'space-between'}>
            <Button disabled={selectedModule === 0} onClick={prevModuleHandler} leftIcon={<AiOutlineLeft/>}>Previous Module</Button>
            <Button disabled={modules && !modules[selectedModule + 1]} onClick={nextModuleHandler} rightIcon={<AiOutlineRight/>}>Next Module</Button>
        </Flex>
        {(modules && !isLoading)
            ? <ModuleView module={modules[selectedModule]}/>
            : <Center><Spinner size='xl'/></Center>}
    </Container>
}

export default Module;
