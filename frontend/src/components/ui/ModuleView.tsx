import * as React from 'react';
import {
    Box,
    Text,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { FrontendModule } from '../../types';

interface ModuleViewProps {
    module: FrontendModule;
}

const ModuleView: React.FC<ModuleViewProps> = ({
    module,
}: ModuleViewProps) => {
    return <Box p={5} border={'2px solid white'} my={5}>
        <Text>{module.name}</Text>
        <Text>{module.description}</Text>
        <Text mt={5}>Learning Materials</Text>
        <ReactMarkdown>{module.materials}</ReactMarkdown>
        <Text mt={5}>Questions</Text>
        <ReactMarkdown>{module.questions}</ReactMarkdown>
    </Box>
}

export default ModuleView;
