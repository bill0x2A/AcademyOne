import * as React from 'react';
import {
    Button,
} from '@chakra-ui/react';
import { useCourseFactory } from '../../web3/useCourseFactoryContract';
import { Container } from '@chakra-ui/react';
import { useAddress } from '../../../context/Address';
import { FACTORY_ADDRESS } from '../../../constants/chain';
import Hero from './Hero';

const Home: React.FC = () => {
    const address = useAddress();
    const contract = useCourseFactory(FACTORY_ADDRESS);

    const testContract = async () => {
        console.log(contract);
        const deployedCourses = await contract.getDeployedCourses();
        console.log(deployedCourses);
    }

    return <Container maxW={'1280px'}>
        <Hero/>
        <Button onClick={testContract}>Test</Button>
    </Container>
};

export default Home;
