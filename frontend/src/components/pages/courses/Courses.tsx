import * as React from 'react';
import {
    Container,
    Heading,
    Grid,
    Spinner,
    Center,
} from "@chakra-ui/react";
import Course from './Course';
import { useSigner } from '../../../context/Signer';
import { useProvider } from '../../../context/Provider';
import { getCourse } from '../../web3/getCourse';
import { useCourseFactory } from '../../web3/useCourseFactoryContract';
import { CourseSummary } from '../../../types';
import { FACTORY_ADDRESS } from '../../../constants/chain';

const Courses: React.FC = () => {
    const courseFactory = useCourseFactory(FACTORY_ADDRESS);
    const provider = useProvider();
    const signer = useSigner();
    const [courseAddresses, setCourseAddresses] = React.useState<string[]>([]);
    const [courses, setCourses] = React.useState<CourseSummary[]>([]);
    
    const shouldShowCoursesLoading = courses.length === 0;

    const getCourseAddresses = async (): Promise<void> => {
        const courseAddrs = await courseFactory.getDeployedCourses();
        console.log(courseAddrs);
        setCourseAddresses(courseAddrs);
    };

    const getCourseInfo = async (address: string): Promise<CourseSummary> => {
            const course = getCourse(address, signer || provider);
            const courseInformation  = await course.getSummaryInformation();
            const [name, description, imageURL, author] = courseInformation;
            return {
                name,
                description,
                imageURL,
                author,
                address,
            };
    };

    const getCourseSummaries = async (): Promise<void> => {
        let courseInfo: CourseSummary[] = []
        for (const ca of courseAddresses) {
            const info = await getCourseInfo(ca);
            courseInfo.push(info);
        }
        setCourses(courseInfo);
    };

    React.useEffect(() => {
        getCourseAddresses();
    }, []);

    React.useEffect(() => {
        if (courseAddresses.length > 0) {
            getCourseSummaries();
        }
    }, [courseAddresses]);

    return <Container maxW={'1280px'} my={10}>
        <Heading>
            Courses
        </Heading>
        {shouldShowCoursesLoading
            ? <Center minH={'calc(100vh - 200px)'}><Spinner size='xl'/></Center>
            : <Grid templateColumns='repeat(2, 1fr)' gap={1}>
                {courses.map((course) => <Course course={course}/>)}
            </Grid>}
    </Container>;
};

export default Courses;
