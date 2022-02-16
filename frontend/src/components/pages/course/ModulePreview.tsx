import * as React from 'react';
import {
    Flex,
    Heading,
    Text,
} from '@chakra-ui/react';
import { Module } from '../../../types';

interface ModulePreviewProps {
    module: Module;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({
    module,
}: ModulePreviewProps) => {
    const {
        name,
        description,
    } = module;
    return <Flex background={'white'} color={'black'} px={5} py={15}>
        <Heading>{name}</Heading>
        <Text>{description}</Text>
    </Flex>
};

export default ModulePreview;
