import { AddIcon } from '@chakra-ui/icons';
import { Button, ModalContent, useColorModeValue, useDisclosure, Modal, ModalOverlay, ModalBody, ModalCloseButton, ModalHeader, ModalFooter, FormControl, Textarea, Text, Input, Flex, CloseButton, Image } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import userpreview from '../hooks/userpreview';
import { BsFillImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useShowToast } from '../hooks/useShowToast';
import postsAtom from '../atoms/postsAtom';
import { useParams } from 'react-router-dom';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


const MAX = 500;

export const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImage, imgUrl, setImgUrl } = userpreview();
  const [postText, setPostText] = useState("");
  const[post,setPosts]=useRecoilState(postsAtom)
  const user = useRecoilValue(userAtom);
  const[loading,setLoading]=useState(false)
  const showToast = useShowToast();
  const [remain, setRemain] = useState(MAX);
  const imageRef = useRef(null);
  const {username}=useParams();

  const handletextchange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX) {
      const truncate = inputText.slice(0, MAX);
      setPostText(truncate);
      setRemain(0);
    } else {
      setPostText(inputText);
      setRemain(MAX - inputText.length);
    }
  };

  const handlePost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiBaseUrl}/posts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl })
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Created", "success");
      if(username===user.username){
        setPosts([data,...post])
      }
      onClose();
      setImgUrl("");
      setPostText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        size={{base:"md",sm:"md",md:"lg"}}
        bg={useColorModeValue("gray.400", "gray.900")}
        colorScheme={useColorModeValue("gray", "gray")}
        onClick={onOpen}
      >
       <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                onChange={handletextchange}
                value={postText}
              />
              <Text fontSize={"xs"} fontWeight="bold" textAlign={"right"} m={"1"} color={"gray.800"}>
                {remain}/{MAX}
              </Text>
              <Input type='file' hidden ref={imageRef} onChange={handleImage} />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected Img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.700"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePost}
            isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
