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
    return  <Stack minH={'200px'} direction={{ base: 'column', md: 'row' }}>
    <Flex p={8} flex={2} align={'center'} justify={'center'}>
      <Stack spacing={6} w={'full'} maxW={'lg'}>
        <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
          <Text
            as={'span'}
            position={'relative'}
            _after={{
              content: "''",
              width: 'full',
              height: useBreakpointValue({ base: '20%', md: '30%' }),
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
            EduDAO aims to change the way we collate and share information with eachother.
            Earn by contributing to or maintaining courses.
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Button
            onClick={() => navigate('/courses')}
            rounded={'full'}
            bg={'tertiary'}
            color={'white'}
            _hover={{
              bg: 'tertiary',
            }}>
            View Courses
          </Button>
          <Button rounded={'full'}>How It Works</Button>
        </Stack>
      </Stack>
    </Flex>
    <Flex flex={1}>
      <Image
        alt={'Cover image'}
        src={education}
      />
    </Flex>
  </Stack>
}

export default Hero;
