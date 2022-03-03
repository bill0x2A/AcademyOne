import * as React from 'react';
import {
    Container,
    Center,
    Image,
} from '@chakra-ui/react';
import shark from '../../../images/png/shark.png';

const FourOhFour: React.FC = () => {
    return <Container  maxW={'1280px'} my={12}>
        <Center>
            <Image borderRadius={'18px'} maxHeight={'400px'} src={shark}/>
        </Center>
    </Container>
};

export default FourOhFour;