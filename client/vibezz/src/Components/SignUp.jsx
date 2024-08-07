'use client';

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom.js';
import userAtom from '../atoms/userAtom.js';
//
export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: '',
    password: '',
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`https://vibe-zz.vercel.app/api/users/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        
        localStorage.setItem('user-vibezz', JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          username: data.username,
          bio: data.bio,
          profilepic: data.profilepic,
          token: data.token,
        }));
        
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        username: data.username,
        bio: data.bio,
        profilepic: data.profilepic,
      });

        toast({
          title: 'Success',
          description: 'Account created successfully',
          status: 'success',
          duration: 700,
          isClosable: true,
          onCloseComplete: () => {
            window.location.href = '/'; 
          },
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Flex
      pb={8}
      align={'center'}
      justify={'center'}
      borderRadius={10}
      bg={useColorModeValue('white', 'gray.light')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={4} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('gray.200', 'gray.light')}
          _hover={{
            bg: useColorModeValue("gray.400", "gray.dark"),
          }}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                    value={inputs.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    value={inputs.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                value={inputs.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  value={inputs.password}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.800')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.700"),
                }}
                onClick={handleSignup}
                isLoading={loading} // Show loading spinner while signing up
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} onClick={() => setAuthScreen("login")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
