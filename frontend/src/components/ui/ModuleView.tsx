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
    return <Box
        position={'relative'}
        p={5}
        pt={'50px'}
        border={'2px solid white'} 
        my={5}>
        <Text
            py={1}
            px={3}
            color='black'
            bg='white'
            position='absolute'
            top={0}
            left={0}>{module.name}</Text>
        <Text color='white'>{module.description}</Text>
        <Text color='white' display={'inline-block'} border={'2px solid white'} px={2} py={1} mt={5}>Learning Materials</Text>
        <Box p={5}>
            <ReactMarkdown>{module.materials}</ReactMarkdown>
        </Box>
        <Text color='white' display={'inline-block'} border={'2px solid white'} px={2} py={1} mt={5}>Questions</Text>
        <Box p={5}>
            <ReactMarkdown>{module.questions}</ReactMarkdown>
        </Box>
    </Box>
}

export default ModuleView;
