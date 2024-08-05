import { Avatar, Flex, Text, Image, Box, Divider, Spinner } from "@chakra-ui/react";
import { usegetpro } from "../hooks/usegetpro.js";
import React, { useEffect, useState } from "react";
import Actions from "../Components/Actions";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from 'date-fns';
import Comment from "../Components/Comment.jsx"
import userAtom from "../atoms/userAtom";
import { useShowToast } from "../hooks/useShowToast";
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom.js";
//

const PostPage = () => {
  const { user, loading } = usegetpro();
  const[posts,setposts]=useRecoilState(postsAtom)
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate=useNavigate()
  const currentpost=posts[0]
  useEffect(() => {
    if (!pid) {
      showToast("Error", "Invalid post ID", "error");
      return;
    }

    const fetchPost = async () => {
      const storedData = JSON.parse(localStorage.getItem('user-vibezz'));
      if (!storedData || !storedData.token) {
        showToast("Error", "No token found in local storage", "error");
        setLoading(false);
        return;
      }

      const token = storedData.token;
      setposts([])
      try {
        const res = await fetch(`https://vibe-zz.vercel.app/api/posts/${pid}`, {
          method: "GET",
          credentials: 'include', 
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          showToast("Error", errorData.error || "Failed to fetch post", "error");
          return;
        }
        const data = await res.json();
       
        setposts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    fetchPost();
  }, [pid,setposts]);
 const handledel=async()=>{
  const storedData = JSON.parse(localStorage.getItem('user-vibezz'));
  if (!storedData || !storedData.token) {
    showToast("Error", "No token found in local storage", "error");
    setLoading(false);
    return;
  }

  const token = storedData.token;
    try {
     
      if(!window.confirm("Are you sure you want to delete this post?"))return;

      const res=await fetch(`https://vibe-zz.vercel.app/api/posts/${currentpost?._id}`,{
        method:"DELETE",
        credentials: 'include', 
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },

      });
      const data=await res.json();
      if(data.error){
        showToast("Error",error.message,"error")
      }
      showToast("Success","Post Deleted!!")
      navigate(`/${user.username}`)
      
    } catch (error) {
      showToast("Error",error.message,"Error")
      
    }
  }


  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentpost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={'md'} name={user?.username} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKhs8Iz3cIFYcbpxRgur5cUXL2UkCp_i-2cw&s" borderRadius="50px" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize="xs" width={67} textAlign={"right"} color="gray.light">
            {formatDistanceToNow(new Date(currentpost.createdAt))} ago
          </Text>
          {currentUser?._id === user?._id && (
            <DeleteIcon size={20} cursor={"pointer"} onClick={handledel} />
          )}
        </Flex>
      </Flex>
      <Text my={3} color={"gray.light"}>{currentpost.text}</Text>
      {currentpost.img && (
        <Box position={"relative"} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={'gray.light'}>
          <Image src={currentpost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentpost} />
      </Flex>
      <Divider my={4} />
      {currentpost.replies.map((reply)=>(
        <Comment 
        reply={reply} 
        key={reply._id} 
        lastreply={
          reply._id ===  currentpost.replies[currentpost.replies.length -1]._id
        }
        />
      ))}
    </>
  );
};

export default PostPage;
