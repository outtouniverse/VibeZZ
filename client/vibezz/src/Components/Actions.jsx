import React, { useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Box ,Text,Modal,FormControl,ModalBody,ModalCloseButton,ModalContent,ModalFooter,ModalHeader,ModalOverlay,useDisclosure,Input,Button} from "@chakra-ui/react";
import { useShowToast } from "../hooks/useShowToast";
import {useRecoilState, useRecoilValue} from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


const Actions = ( {post} ) => {
    const[posts,setpost]=useRecoilState(postsAtom);
    const user=useRecoilValue(userAtom);
    const [liked,setLiked]=useState(post.likes.includes(user?._id));
    const showtoast=useShowToast();
    const[islike,setislike]=useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isreply,setisreply]=useState(false)
    const[reply,setreply]=useState("")


    const handlelike=async()=>{
        if(!user) return showtoast('Error',"Log in to like",'error')
        if(islike)return;
        setislike(true)
        try {
            const res=await fetch(`${apiBaseUrl}/api/posts/like/`+post._id,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({userId:user._id})
            })

            const data=await res.json()
          if(!liked){
            const update=posts.map((p)=>{
                if(p._id===post._id){
                    return {...p,likes:[...p.likes,user._id]}
                }return p
            })
            setpost(update)
          }else{
           const update=posts.map((p)=>{
            if(p._id===post._id){
                return {...p,likes:p.likes.filter((id)=>id!==user._id)}
            }return p
           })
           setpost(update)
          }
          setLiked(!liked)
            
        } catch (error) {
            showtoast("Error",error.message,"error")
        }finally{
            setislike(false)
        }
    }

    const handlereply=async()=>{
        if(!user) return showtoast('Error',"Log in to reply",'error')
        if(isreply) return;
        setisreply(true);   
        try{
            const res=await fetch(`${apiBaseUrl}/api/posts/reply/`+post._id,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({text:reply})

            }   
        )
        const data=await res.json()
        if(data.error){
            showtoast("Error",data.error,"error")
        }
        const update=posts.map((p)=>{
            if(p._id===post._id){
                return {...p,replies:[...p.replies,data]}
            }
            return p
        })
        setpost(update)
        showtoast("Reply Posted","Replied","success")
        onClose()
        setreply("")


        }catch(err){
            showtoast("Error",err.message,'error')
            console.log(err)
        }finally{
            setisreply(false)
        }
    }
    return (
        <Flex flexDirection={"column"}>
        <Flex gap={4} my={15} pl={0} onClick={(e) => e.preventDefault()}>
            <svg
                aria-label='Like'
                color={liked ? "rgb(237, 73, 86)" : "currentColor"}
                fill={liked ? "rgb(237, 73, 86)" : "none"}
                height='20'
                role='img'
                viewBox='0 0 24 24'
                width='20'
                onClick={handlelike}
                style={{ cursor: "pointer" }}
            >
                <path
                    d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
                    stroke='currentColor'
                    strokeWidth='2'
                ></path>
            </svg>

            <svg
                aria-label='Comment'
                color='currentColor'
                fill='none'
                height='20'
                role='img'
                viewBox="0 0 24 24"
                onClick={onOpen}
                width='20'
                style={{ cursor: "pointer" }}
                
            >
                <title>Comment</title>
                <path
                    d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 1 1 17 0Z'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                ></path>
            </svg>
            <Repost/>
            <Share/>
        </Flex>
        <Flex gap={3} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>{post.replies.length} replies</Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}> </Box>
            <Text color={"gray.light"} fontSize={"sm"}>{post.likes.length} likes</Text>
          </Flex>
          <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input  placeholder='Add your Reply....' value={reply}
              onChange={(e)=>setreply(e.target.value)}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' size={"sm"} mr={3} 
            isLoading={isreply}
            onClick={handlereply}>
          Reply
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>

          </Flex>
        
       
    );
};



export default Actions;

const Repost=()=>{
    return (
        <svg
        aria-label='Repost'
        color='currentColor'
        fill='none'
        height='20'
        role='img'
        viewBox="0 0 24 24"
        width='20'
        style={{ cursor: "pointer" }}
        onClick={() => console.log('Repost')}
    >
        <title>Repost</title>
        <path
            d='M4 4v6h6M20 20v-6h-6M4 10l6 6M20 14l-6 6'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
        ></path>
    </svg>

    )
}

const Share=()=>{
    return ( <svg
        aria-label='Share'
        color='currentColor'
        fill='none'
        height='20'
        role='img'
        viewBox="0 0 24 24"
        width='20'
        style={{ cursor: "pointer" }}
        onClick={() => console.log('Share')}
    >
        <title>Share</title>
        <path
            d='M18 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0zM12 14v6'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
        ></path>
        <path
            d='M8 18h8'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
        ></path>
    </svg>
    )}