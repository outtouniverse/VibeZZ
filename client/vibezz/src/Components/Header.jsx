import { Flex, useColorMode, Image, Link } from "@chakra-ui/react";
import React, { useEffect,useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { usegetpro } from "../hooks/usegetpro";
import { Link as RouterLink } from "react-router-dom";
import { BsHouseExclamationFill, BsPersonCircle } from "react-icons/bs";
import postsAtom from "../atoms/postsAtom";
import { useRecoilState } from "recoil";
import { Avatar } from "@chakra-ui/react"; 
import authAtom from "../atoms/authAtom.js"
import { useShowToast } from '../hooks/useShowToast';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const authScreenAtom=useSetRecoilState(authAtom)
  const { user, loading } = usegetpro();
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetching, setFetching] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
      const fetchPosts = async () => {
          if (user && user.username) {
              const storedData = JSON.parse(localStorage.getItem('user-vibezz'));
              if (!storedData || !storedData.token) {
                showToast("Error", "No token found in local storage", "error");
               
                return;
              }
      
              const token = storedData.token;
              try {
                  setFetching(true);
                  const response = await fetch(`https://vibe-zz.vercel.app/api/posts/user/${user.username}`,{
                      credentials: 'include', 
                      headers: {
                        'x-auth-token': token,
                        'Content-Type': 'application/json',
                      },
                  });
                 
                  if (!response.ok) {
                      throw new Error("Failed to fetch posts");
                  }
                  const data = await response.json();
                  
                  setPosts(Array.isArray(data.posts) ? data.posts : []);
              } catch (error) {
                  console.error('Error fetching posts:', error); 
                  showToast("Error","Failed to fetch posts", "error");
              } finally {
                  setFetching(false);
                  console.log('Finished fetching');
              }
          }
      };
      fetchPosts();
  }, [user,setPosts]);

  return (
    <Flex justifyContent="space-between" mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <BsHouseExclamationFill size={24} />
        </Link>
      )}
      {!user && (
        <Link as={RouterLink} 
        to={'/auth'}
        onClick={
          ()=>authScreenAtom("login")
        }>
         Login
        </Link>
      )}

      <Image
        cursor="pointer"
        alt="logo"
        borderRadius="full"
        height={"70px"}
        w={16}
        src={colorMode === "dark" ?  "Light Vector.png": "Dark Vector.png" }
        onClick={toggleColorMode}
      />

{!user && (
  <Link as={RouterLink} onClick={
    ()=>authScreenAtom('signup')
  }>
   SignUp
  </Link>
)}
      {user && (
        <Link as={RouterLink} to={`/${user.username}`}>
         <Avatar size="sm" src={user.profilePic} />
        </Link>
      )}
    </Flex>

    
  );
};



export default Header;
