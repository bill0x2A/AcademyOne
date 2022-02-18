import * as React from 'react';
import {
    Box,
    Text,
    Input,
    FormLabel,
    Button,
} from '@chakra-ui/react';
import { ImCross } from 'react-icons/im';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { MarkdownData } from '../../../types';
const mdParser = new MarkdownIt();

interface ModuleEditorProps {
    name: string;
    description: string;
    materials: string;
    questions: string;
    handleNameChange: React.ChangeEventHandler<HTMLInputElement>;
    handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement>;
    handleMaterialsDataChange: (data: MarkdownData) => void;
    handleQuestionsDataChange: (data: MarkdownData) => void;
    deleteModuleHandler: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({
    name,
    description,
    materials,
    questions,
    handleNameChange,
    handleDescriptionChange,
    handleMaterialsDataChange,
    handleQuestionsDataChange,
    deleteModuleHandler,
}) => {
    return <Box background={'blue.700'} position='relative' border={'3px solid white'} py={8} px={5} my={5}>
            <Button
            onClick={deleteModuleHandler}
            colorScheme='red'
            position='absolute'
            top={'-3px'}
            right={'-3px'}
            borderRadius={0}
            border={'3px solid white'}>
                <ImCross/>
            </Button>
        <FormLabel>Module Name</FormLabel>
        <Input
            value={name}
            onChange={handleNameChange}
            background='white'
            color='black'
            mb={5}/>
        <FormLabel>Module Description</FormLabel>
        <Input
            value={description}
            onChange={handleDescriptionChange}
            placeholder='Module name'
            background={'white'}
            color='black'
            mb={5}/>
        <Text>Materials</Text>
        <MdEditor
            style={{ height: '500px' }}
            renderHTML={text => mdParser.render(text)}
            onChange={handleMaterialsDataChange}
            value={materials}/>
        <Text mt={5}>Questions</Text>
        <MdEditor
            style={{ height: '200px' }}
            renderHTML={text => mdParser.render(text)}
            onChange={handleQuestionsDataChange}
            value={questions}/>
    </Box>
}

export default ModuleEditor;
