import * as React from 'react';
import {
    Button,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useBreakpointValue,
  } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import education from '../../../images/svg/education.svg';

const Hero: React.FC = () => {
    const navigate = useNavigate();
    return  <Flex my={'140px'}>
    <Flex p={8} flex={1} alignItems={'center'} justify={'center'}>
      <Stack spacing={6} w={'full'} maxW={'lg'}>
        <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
          <Text
            as={'span'}
            position={'relative'}
            _after={{
              content: "''",
              width: 'full',
              height: '300px',
              position: 'absolute',
              bottom: 1,
              left: 0,
              bg: 'tertiary',
              zIndex: -1,
            }}>
            Education
          </Text>
          <br />{' '}
          <Text color={'tertiary'} as={'span'}>
            Done differently
          </Text>{' '}
        </Heading>
        <Text fontSize={{ base: 'md', lg: 'lg' }} color={'white'}>
            AcademyONE aims to change the way we collate and share information with eachother.
            Earn by contributing to or maintaining courses.
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Button
            onClick={() => navigate('/courses')}
            borderRadius={0}
            bg={'tertiary'}
            border='2px solid white'
            color={'white'}
            _hover={{
              bg: 'tertiary',
            }}>
            View Courses
          </Button>
          <Button borderRadius={0} border='2px solid white'>How It Works</Button>
        </Stack>
      </Stack>
    </Flex>
    <Flex flex={1}>
      <Image
        position='relative'
        top="20px"
        alt={'Cover image'}
        src={education}
        height="300px"
      />
    </Flex>
    </Flex>
}

export default Hero;
