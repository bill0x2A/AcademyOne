import * as React from 'react';
import { useAddress } from '../../../context/Address';
import {
    Heading,
    Flex,
    Text,
    Button,
} from '@chakra-ui/react';
import ModuleEditor from './ModuleEditor';
import { FiPlus } from 'react-icons/fi';
import { FrontendModule } from '../../../types';

interface AddModulesProps {

}

const AddModules: React.FC<AddModulesProps> = ({

}: AddModulesProps) => {
    const address = useAddress();
    const [modules, setModules] = React.useState<FrontendModule[]>([{
        name: '',
        description: '',
        author: address || '',
        materials: '',
        questions: '',
    },]);

    const addNewModule = (): void => {
        const newModule: FrontendModule = {
            name: '',
            description: '',
            author: address || '',
            materials: '',
            questions: '',
        };
        setModules([...modules, newModule]);
        console.log(modules);
    };

    const handleMaterialsDataChange = (index: number, data: any) => {
        const newModules = [...modules];
        newModules[index].materials = data;
        setModules(newModules);
    }

    const handleQuestionsDataChange = (index: number, data: any) => {
        const newModules = [...modules];
        newModules[index].questions = data;
        setModules(newModules);
    }

    return <>
        {modules.length}
        <Flex justifyContent={'space-between'}>
            <Heading>Add course modules</Heading>
            <hr/>
            <Button
                colorScheme={'purple'}
                rightIcon={<FiPlus/>}
                onClick={addNewModule}
                >Add Module</Button>
        </Flex>
        {modules.map((module, index) => {
                const { name, description } = module;
                return <ModuleEditor
                    name={name}
                    description={description}
                    handleMaterialsDataChange={(data: any) => handleMaterialsDataChange(index, data)}
                    handleQuestionsDataChange={(data: any) => handleQuestionsDataChange(index, data)}/>
            })}
    </>
};

export default AddModules;
