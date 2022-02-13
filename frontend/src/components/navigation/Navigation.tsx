import * as React from 'react';
import Identicon from 'react-identicons';
import {
  Box,
  Flex,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from '@chakra-ui/react';
import { useAddress } from '../../context/Address';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { GiSpellBook } from 'react-icons/gi';
import ConnectWallet from './ConnectWallet';

const NavLink = ({ children }: { children: React.ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

interface NavProps {
  connectWallet: () => void;
}

const Nav: React.FC<NavProps> = ({
  connectWallet,
}: NavProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const address = useAddress();

  const isWalletConnected = !!address;

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Stack direction={'row'}>
            <GiSpellBook size={20}/>
            <Box>EduDAO</Box>
          </Stack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              { isWalletConnected ?
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Identicon size={32} string={address}/>
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Identicon string={address} size={100} background={'white'}></Identicon>
                    </Center>
                    <br />
                    <Center>
                      <p>{address}</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
                : <ConnectWallet connectWallet={connectWallet}/> }
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default  Nav;