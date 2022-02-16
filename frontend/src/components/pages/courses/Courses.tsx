import * as React from 'react';
import {
    Container,
    Heading,
    Grid,
} from "@chakra-ui/react";
import Course from './Course';
import { useSigner } from '../../../context/Signer';
import { useProvider } from '../../../context/Provider';
import { getCourse } from '../../web3/getCourse';
import { useCourseFactory } from '../../web3/useCourseFactoryContract';
import { CourseSummary } from '../../../types';

const Courses = () => {
    const courseFactory = useCourseFactory('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
    const [courseAddresses, setCourseAddresses] = React.useState<string[]>([]);

    const getCourseAddresses = async (): Promise<void> => {
        const courseAddrs = await courseFactory.getDeployedCourses();
        setCourseAddresses(courseAddrs);
    };

    const getCourseInfo = async (address: string): Promise<any> => {
        const course = getCourse(address, );
    };

    React.useEffect(() => {
        getCourseAddresses();
    }, []);

    React.useEffect(() => {
        if (courseAddresses.length > 0) {

        }
    }, [courseAddresses]);

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
