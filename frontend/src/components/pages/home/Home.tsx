import * as React from 'react';
import {
    Button,
} from '@chakra-ui/react';
import { useCourseFactory } from '../../web3/useCourseFactoryContract';
import { Container } from '@chakra-ui/react';
import { useAddress } from '../../../context/Address';
import Hero from './Hero';

const Home: React.FC = () => {
    const address = useAddress();
    const contract = useCourseFactory('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');

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
