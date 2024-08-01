import { Avatar, Flex,Box,Text,Image } from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import Actions from "../Components/Actions";


const UserPost=({postImg,postTitle,likes,replies})=>{
    return(
        <Link to={"/elon/post/1"}>
            <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={'column'} alignitems={"center"}>
                <Avatar size="md" name="Elon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSpv6ay5wgc4lHdHzUAyWVjUjCVtwdRBvXWw&s"/>
                <Box w="1px" h={"full"} bg="gray.light" my={"2"}></Box>
                <Box position={"relative"} w={"full"}>
                    <Avatar size="xs" name="bill" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBGYFpoMjjaUrYe8SOnAvX_EyDyA0E6ja2fw&s" position={"absolute"} top={"0px"} left="15px" padding={"2px"}/>
                    <Avatar size="xs" name="zuck" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5W2BqfqBY9OafH2zmvvBjg-sAFRYogwwvUA&s" position={"absolute"} top={"0px"} left="-10px" padding={"2px"}/>
                    <Avatar size="xs" name="sam" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjZH5iNInavXZiTmr3WrxoZAkALWlE-KEorw&s" position={"absolute"} bottom={"0px"} left="2px" padding={"2px"}/>
                </Box>
                </Flex>
               
                <Flex flex={1} flexDirection={"column"} gap={"2px"}>
                <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            Elon Musk
                        </Text>
                        <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKhs8Iz3cIFYcbpxRgur5cUXL2UkCp_i-2cw&s"  borderRadius="50px"  w={4} h={4} ml={1}/>
                    
                        </Flex>
                       
                        <Flex gap={4} alignItems={"center"} >
                        <Text fontStyle={"sm"} color={"gray.light"}>1d</Text>
                        <Image
                    cursor="pointer"
                    alt="logo"
                    w={5}
                    borderRadius={50}
                    src={"three.png"}  
                />   
                        </Flex>
                    </Flex>
                    <Text fontSize={"sm"}>{postTitle}</Text>
                    <Box position={"relative"} borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={'gray.light'}>
                        <Image src={postImg} w={"full"}/>
                    </Box>
                    <Flex gap={3} my={1}>
                        <Actions/>
                    </Flex>
                    <Flex gap={3} alignItems={"center"}>
                        <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
                        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}>  </Box>
                        <Text color={"gray.light"} fontSize={"sm"}>{likes} likes

                        </Text>

                      
                    </Flex>
                </Flex>
             
            </Flex>
                
        </Link>
    )
}

export default UserPost; 