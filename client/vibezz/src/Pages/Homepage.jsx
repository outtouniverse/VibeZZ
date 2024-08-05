import React, { useEffect, useState } from 'react';
import Post from "../Components/Post";
import { Avatar, Box, Spinner, VStack, Flex, useColorModeValue, Text } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import { useShowToast } from '../hooks/useShowToast';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [feedPosts, setFeedPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();
  const [user] = useRecoilState(userAtom); // Only read user info from state

  const bgColor = useColorModeValue('gray.400', 'gray.light');
  const hoverBgColor = useColorModeValue('gray.500', 'gray.dark');

  useEffect(() => {
    const getFeed = async () => {
      const storedData = JSON.parse(localStorage.getItem('user-vibezz'));
      const token = storedData?.token;

      if (!token) {
        showToast("Error", "No token found in local storage", "error");
        setLoading(false);
        return;
      }

      setLoading(true);
      setFeedPosts([]);
      try {
        const response = await fetch(`https://vibe-zz.vercel.app/api/posts/feed`, {
          method: "GET",
          headers: {
            'x-auth-token': token, 
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await response.json();
        console.log('Feed Data:', data);
        setFeedPosts(data.feedpost || []);
      } catch (err) {
        showToast("Error", err.message, "error");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const getUsers = async () => {
      try {
        const res = await fetch(`https://vibe-zz.vercel.app/api/users/alluser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Network response was not ok');
        }

        const data = await res.json();
        setUsers(data || []);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getFeed();
    getUsers();
  }, [setFeedPosts]);

  if (loading) {
    return (
      <Flex justifyContent='center' p={4}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentUser = users.find(u => u.username === user.username);
  const followingList = currentUser ? currentUser.following : [];

  const filteredUsers = users.filter(u => u.username !== user.username && !followingList.includes(u._id));

  return (
    <Flex p={4} direction="row" justifyContent="space-between" align="flex-start">
      <Box flex="3" mr={"10"}>
        {feedPosts.length === 0 ? (
          <Text>No posts available. Follow other users to see the posts.</Text>
        ) : (
          feedPosts.map((post) => (
            <Post
              key={post._id}
              post={post}
              postedBy={post.postedBy}
            />
          ))
        )}
      </Box>

      <Box flex="1" width="10">
        {filteredUsers.length > 0 && (
          <Text fontSize="xl" fontWeight="bold" mb={8}>
            All Users
          </Text>
        )}
        {filteredUsers.length === 0 ? (
          <Text>No users to display.</Text>
        ) : (
          <VStack align="stretch">
            {filteredUsers.map(u => (
              <Box 
                key={u._id} 
                p={2} 
                mb={2}  
                borderRadius={5}
                bg={bgColor}
                _hover={{
                  bg: hoverBgColor,
                }}
                width="200px" 
                minHeight="70px" 
                display="flex"
                alignItems="center"
              >
                <Flex align="center">
                  <Link to={`/${u.username}`}>
                    <Avatar src={u.profilePic} />
                  </Link>
                  <Box ml={4}>
                    <Link to={`/${u.username}`}>
                      <Text fontSize="md">{u.name}</Text>
                    </Link>
                    <Text fontSize="sm">
                      {u.followers.length} followers
                    </Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default HomePage;
