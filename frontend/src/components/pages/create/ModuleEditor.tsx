import * as React from 'react';
import {
    Box,
    Text,
} from '@chakra-ui/react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

const mdParser = new MarkdownIt();

interface ModuleEditorProps {
    name: string;
    description: string;
    handleMaterialsDataChange: any;
    handleQuestionsDataChange: any;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({
    name,
    description,
    handleMaterialsDataChange,
    handleQuestionsDataChange,
}) => {
    return <Box border={'3px dashed'} py={8} px={5} my={5}>
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>Materials</Text>
        <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleMaterialsDataChange} />
        <Text>Questions</Text>
        <MdEditor style={{ height: '200px' }} renderHTML={text => mdParser.render(text)} onChange={handleQuestionsDataChange} />
    </Box>
}

export default ModuleEditor;
