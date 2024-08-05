import React, { useState, useRef } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Center,
  Avatar,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useShowToast } from '../hooks/useShowToast';

import userpreview from '../hooks/userpreview';
//

export default function UpdateProfile() {
  const [user, setUser] = useRecoilState(userAtom);
  const[loading,setLoading]=useState(false);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilepic: user.profilepic,
    password: '',
  });
  const fileref = useRef(null);
  const { handleImage, imgUrl } = userpreview();
  const showToast = useShowToast();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const storedData = JSON.parse(localStorage.getItem('user-vibezz'));
        if (!storedData || !storedData.token) {
          showToast("Error", "No token found in local storage", "error");
         
          return;
        }

        const token = storedData.token;
        console.log("Retrieved Token:", token);
    try {
      const res = await fetch(`https://vibe-zz.vercel.app/api/users/update/${user._id}`, {
        method: 'PUT',
        credentials: 'include', 
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }), 
      });
      const data = await res.json();
      setLoading(true)
      if (data.error) {
        showToast(data.error, 'error');
      } else {
        setUser(data); 
        
        localStorage.setItem('user-vibezz', JSON.stringify(data)); 
        showToast("Success",'Profile updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update profile', error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handlesubmit}>
      <Flex
        minH={'5vh'}
        borderRadius={20}
        my={6}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('white', 'gray.800')}>
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.800')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <FormLabel>User Icon</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size='xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
              </Center>
              <Center w='full'>
                <Button w='full' onClick={() => fileref.current.click()}>
                  Change Avatar
                </Button>
                <Input type='file' hidden ref={fileref} onChange={handleImage} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="Fullname"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="UserName"
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>BIO</FormLabel>
            <Input
              placeholder="add your bio"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: 'gray.500' }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
               loadingText="Updating"
              bg={'green.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'green.500',
              }}>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
