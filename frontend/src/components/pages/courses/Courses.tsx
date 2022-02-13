import * as React from 'react';
import {
    Container,
    Heading,
    Grid,
} from "@chakra-ui/react";
import Course from './Course';
import { CourseSummary } from '../../../types';

const fakeCourses: CourseSummary[] = [
    {
        imageURL: 'https://i0.wp.com/www.garage-bar.co.uk/wp-content/uploads/Carling-Beer-Interlocking-Pint-Glass.jpg',
        name: 'Drinking wee',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti, quis tempore dolores odio perferendis libero soluta quibusdam. Sequi, sit.',
        author: '0x829y1nd028ha029pjcp9wcjpjwc',
        address: '0xoihawfihw',
    },
    {
        imageURL: 'https://i0.wp.com/www.garage-bar.co.uk/wp-content/uploads/Carling-Beer-Interlocking-Pint-Glass.jpg',
        name: 'Drinking wee',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti, quis tempore dolores odio perferendis libero soluta quibusdam. Sequi, sit.',
        author: '0x829y1nd028ha029pjcp9wcjpjwc',
        address: '0xoihawfihw',
    },
    {
        imageURL: 'https://i0.wp.com/www.garage-bar.co.uk/wp-content/uploads/Carling-Beer-Interlocking-Pint-Glass.jpg',
        name: 'Drinking wee',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti, quis tempore dolores odio perferendis libero soluta quibusdam. Sequi, sit.',
        author: '0x829y1nd028ha029pjcp9wcjpjwc',
        address: '0xoihawfihw',
    },
    {
        imageURL: 'https://i0.wp.com/www.garage-bar.co.uk/wp-content/uploads/Carling-Beer-Interlocking-Pint-Glass.jpg',
        name: 'Drinking wee',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti, quis tempore dolores odio perferendis libero soluta quibusdam. Sequi, sit.',
        author: '0x829y1nd028ha029pjcp9wcjpjwc',
        address: '0xoihawfihw',
    },
    {
        imageURL: 'https://i0.wp.com/www.garage-bar.co.uk/wp-content/uploads/Carling-Beer-Interlocking-Pint-Glass.jpg',
        name: 'Drinking wee',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti, quis tempore dolores odio perferendis libero soluta quibusdam. Sequi, sit.',
        author: '0x829y1nd028ha029pjcp9wcjpjwc',
        address: '0xoihawfihw',
    },
]

const Courses = () => {
    return <Container maxW={'1280px'} my={10}>
        <Heading>
            Courses
        </Heading>
        <Grid templateColumns='repeat(2, 1fr)' gap={1}>
            {fakeCourses.map((course) => <Course course={course}/>)}
        </Grid>
    </Container>
}

export default Courses;
