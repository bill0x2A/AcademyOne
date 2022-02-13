import * as React from 'react';
import { Container } from '@chakra-ui/react';
import { useContract } from '../../../context/Contract';
import { useAddress } from '../../../context/Address';
import Hero from './Hero';

const Home: React.FC = () => {
    const contract = useContract();
    const address = useAddress();

    return <Container maxW={'1280px'}>
        <Hero/>
    </Container>
};

export default Home;
