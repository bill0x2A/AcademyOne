import * as React from 'react';

import {
    Box,
    Center,
    Image,
    Text,
    Heading,
    Stack,
    Avatar,
    useColorModeValue,
    Container,
} from '@chakra-ui/react';

const About:React.FC = () => {
    return <Container maxW={'1280px'} my={10}>
        <Heading>
            About
        </Heading>
        <Box>
            <Text
                color={'green.500'}
                textTransform={'uppercase'}
                fontWeight={800}
                fontSize={'sm'}
                letterSpacing={1.1}>
                This is a box
            </Text>
        </Box>
    </Container>
    
}

export default About;