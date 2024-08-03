'use client'

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
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom.js';
import userAtom from '../atoms/userAtom.js';
import { useShowToast } from '../hooks/useShowToast.js';
//
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const[error,setError]=useState("")
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const showToast = useShowToast();
  const [loading,setLoading]=useState(false)

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const token = JSON.parse(localStorage.getItem('user-vibezz'))?.token;
  if (!token) {
    console.error('No token found, please log in again.');
    setError('Not authenticated');
    return;
  }

  const handleLogin = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    try {
      const res = await fetch(`https://vibe-zz.vercel.app/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(inputs),
      });
  
      const data = await res.json();
  
      if (data.error) {
        showToast("Error", data.error, "error");
        setError(data.error); // Set error message
        return;
      }
  
      localStorage.setItem('user-vibezz', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Error during login:', error);
      showToast('Error', error.toString(), 'error');
      setError(error.toString()); // Set error message
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Flex pb={8} align={'center'} justify={'center'}
    borderRadius={10}
     bg={useColorModeValue('white', 'gray.light')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={4} px={4}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          height={360}
          width={400}
          bg={useColorModeValue('gray.200', 'gray.light')}
          _hover={{
            bg: useColorModeValue("gray.400", "gray.dark"),
          }}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
          <Box >
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={inputs.username}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
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
            <Stack spacing={10} pt={5}>
              <Button
                loadingText="Loggin In"
                size="lg"
                bg={useColorModeValue('gray.600', 'gray.800')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.700'),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link onClick={() => setAuthScreen('SignUp')} color={'blue.400'}>
                  SignUp
                </Link>
              </Text>
            </Stack>
            </Box>
          </Stack>
          
        </Box>
      </Stack>
    </Flex>
  );
}
