import { Avatar, Flex, Box, Text, Image } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Actions from "../Components/Actions";
import { useShowToast } from '../hooks/useShowToast';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilValue,useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';

const Post = ({ post, postedBy }) => {
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentuser=useRecoilValue(userAtom)

  const navigate=useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
       

        if (data.error) {
          showToast(data.error, "error");
          return;
        }
       
        setUser(data);
        
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    }; 
    getUser();
   
  }, [postedBy]); 

  const handledel=async(e)=>{
    try {
      e.preventDefault()
      if(!window.confirm("Are you sure you want to delete this post?"))return;

      const res=await fetch(`/api/posts/${post?._id}`,{
        method:"DELETE",
        headers: {
          "Content-Type": "application/json",
        }

      });
      const data=await res.json();
      if(data.error){
        showToast("Error",error.message,"error")
      }
      showToast("Success","Post Deleted!!")
      setPosts(posts.filter((p)=>p._id !== post._id))
    } catch (error) {
      showToast("Error",error.message,"Error")
      
    }
  }
if(!user) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={"center"}>
          <Avatar size="md"  src={user?.profilePic}
          onClick={(e)=>{
            e.preventDefault();
            navigate(`/${user?.username}`)

          }} />
         
          <Box w="1px" h={"full"} bg="gray.light" my={"2"}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length==0 && <Text textAlign={"center"}>👻</Text>}
            {post.replies[0] && (
              <Avatar size="xs"  src={post.replies[0].userProfilePic} position={"absolute"} top={"0px"} left="15px" padding={"2px"} />
            )}
            {post.replies[1] && (
              <Avatar size="xs"  src={post.replies[1].userProfilePic} position={"absolute"} top={"0px"} left="15px" padding={"2px"} />
            )}
            {post.replies[2] && (
              <Avatar size="xs" src={post.replies[2].userProfilePic} position={"absolute"} top={"0px"} left="-10px" padding={"2px"} />
            )}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={"2px"}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}
               onClick={(e)=>{
                e.preventDefault();
                navigate(`/${user?.username}`)
    
              }}>
                {user?.username}
              </Text>
              <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKhs8Iz3cIFYcbpxRgur5cUXL2UkCp_i-2cw&s" borderRadius="50px" w={4} h={4} ml={1} />
            </Flex>

            <Flex gap={4} alignItems={"center"}>
            <Text fontSize="xs" width={67} textAlign={"right"} color="gray.light">
        {formatDistanceToNow(new Date(post.createdAt))} ago
      </Text>
      {currentuser?._id === user?._id && (
                <DeleteIcon size={20} onClick={handledel} />
              )}
     
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box position={"relative"} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={'gray.light'}>
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
         
        </Flex>
      </Flex>
    </Link>
  );
}

export default Post;
