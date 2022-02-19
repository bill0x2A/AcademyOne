import * as React from 'react';
import { Container } from '@chakra-ui/react';
import Hero from './Hero';

const Home: React.FC = () => {

    return <Container maxW={'1280px'}>
        <Hero/>
    </Container>
};

export default Home;
