import * as React from 'react';
import {
    Flex,
    Heading,
    Text,
} from '@chakra-ui/react';
import { FrontendModule } from '../../../types';

interface ModulePreviewProps {
    module: FrontendModule;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({
    module,
}: ModulePreviewProps) => {
    const {
        name,
        description,
    } = module;
    return <Flex
        my={5}
        flexDirection={'column'}
        border='2px solid white'
        color={'white'}
        px={5}
        py={15}>
        <Heading fontSize={22}>{name}</Heading>
        <Text fontSize={18}>{description}</Text>
    </Flex>
};

export default ModulePreview;
