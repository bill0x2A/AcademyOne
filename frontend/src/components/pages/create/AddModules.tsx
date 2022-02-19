import * as React from 'react';
import {
    Heading,
    Flex,
    Button,
} from '@chakra-ui/react';
import ModuleEditor from './ModuleEditor';
import { FiPlus } from 'react-icons/fi';
import { FrontendModule, MarkdownData } from '../../../types';

interface AddModulesProps {
    modules: FrontendModule[];
    addNewModule: () => void;
    handleNameChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDescriptionChange: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    handleMaterialsDataChange: (index: number, data: MarkdownData) => void;
    handleQuestionsDataChange: (index: number, data: MarkdownData) => void;
    deleteModuleHandler: (id: string) => void;
}

const AddModules: React.FC<AddModulesProps> = ({
    modules,
    addNewModule,
    handleNameChange,
    handleDescriptionChange,
    handleMaterialsDataChange,
    handleQuestionsDataChange,
    deleteModuleHandler,
}: AddModulesProps) => {

    return <>
        <Flex mt={10} justifyContent={'flex-end'}>
            <Button
                colorScheme={'purple'}
                rightIcon={<FiPlus/>}
                onClick={addNewModule}
                >Add Module</Button>
        </Flex>
        {modules.map((module, index) => {
                const { name, description, materials, questions } = module;
                return <ModuleEditor
                    key={module.id}
                    name={name}
                    description={description}
                    materials={materials}
                    questions={questions}
                    handleNameChange={(event: React.ChangeEvent<HTMLInputElement>) => handleNameChange(index, event)}
                    handleDescriptionChange={(event: React.ChangeEvent<HTMLInputElement>) => handleDescriptionChange(index, event)}
                    handleMaterialsDataChange={(data: MarkdownData) => handleMaterialsDataChange(index, data)}
                    handleQuestionsDataChange={(data: MarkdownData) => handleQuestionsDataChange(index, data)}
                    deleteModuleHandler={() => deleteModuleHandler(module.id)}/>
            })}
    </>
};

export default AddModules;
