import * as React from 'react';
import {
    Center,
    Text,
    Flex,
    Link,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const NavLink = ({ children, path }: { children: React.ReactNode, path: string }) => {
    const navigate = useNavigate(); 
    return   <Link
        color='white'
        px={2}
        py={1}
        ml={'5px'}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: 'tertiary',
        }}
        onClick={() => navigate(path)}>
        {children}
    </Link>
  }

const Footer: React.FC = () => {
    return <Center position='absolute' bottom='0px' mt={'100px'} width={'100vw'} height='150px' background='secondary'>
        <Flex flexDirection={'column'} justifyContent='center' alignItems='center'>
            <Flex mb={5}>
                <NavLink path={'/roadmap'}>Roadmap</NavLink>
                <NavLink path={'/about'}>About</NavLink>
            </Flex>
            <Text color='white'>
                {'Made with ❤️ && 😭 for EthDenver 2022'}
            </Text>
        </Flex>
    </Center>
}

export default Footer;
