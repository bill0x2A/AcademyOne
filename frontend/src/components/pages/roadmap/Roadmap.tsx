import * as React from 'react';
import {
    Container,
    Heading,
} from '@chakra-ui/react';
import { Chrono } from 'react-chrono';

const Roadmap: React.FC = () => {

    const roadmapItems = [
        {
            title: 'EthDenver 2022 Demo',
            cardTitle: 'Demo created for EthDenver 2022',
            cardDetailedText: 'The project is conceptualised and a (flawed) demo is created in just a week!',
        },
        {
            title: 'Alpha testnet launch',
            carTitle: 'Alpha',
            cardDetailedText: 'A more carefully though out system is launched. This version is to greatly improve the structure of the course DAOs and will include the first implementation of payment for course contribution.'
        },
        {
            title: 'MetaDAO formation',
            cardTitle: '',
        }
    ]

    return <Container maxW='1280px'>
        <Heading>Project Roadmap</Heading>
        <hr/>
        <Chrono
            items={roadmapItems}
            mode='VERTICAL'
            hideControls
        />
    </Container>
}

export default Roadmap;
