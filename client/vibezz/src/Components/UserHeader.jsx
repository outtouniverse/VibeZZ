import {
    VStack,
    Box,
    Flex,
    Avatar,
    Text,
    Link,
    Button,
    Menu,
    MenuButton,
    Portal,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { BsInstagram, BsThreeDots } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import { useShowToast } from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
//
const UserHeader = ({ user }) => {
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [updating, setupdating] = useState(false);
    const [following, setFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(user.followers.length);

    useEffect(() => {
        setFollowing(user.followers.includes(currentUser?._id));
    }, [user.followers, currentUser?._id]);

    const handleFollow = async () => {
        if (!currentUser) {
            showToast("You need to login to follow", "", "error");
            return;
        }

        setupdating(true);
        const storedData = JSON.parse(localStorage.getItem('user-vibezz'));
        if (!storedData || !storedData.token) {
          showToast("Error", "No token found in local storage", "error");
          
          return;
        }

        const token = storedData.token;

        try {
            const res = await fetch(`https://vibe-zz.vercel.app/api/users/follow/${user._id}`, {
                method: "POST",
                credentials: 'include', 
                headers: {
                  'x-auth-token': token,
                  'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (data.error) {
                showToast(data.error, "", "error");
                return;
            }

            if (data.message === "User followed") {
                setFollowing(true);
                setFollowerCount((prevCount) => prevCount + 1);
                showToast(`Followed ${user.name}`, "", "success");
            } else if (data.message === "User unfollowed") {
                setFollowing(false);
                setFollowerCount((prevCount) => prevCount - 1);
                showToast(`Unfollowed ${user.name}`, "", "success");
            }
        } catch (error) {
            showToast(error.message, "", "error");
        } finally {
            setupdating(false);
        }
    };

    const copyurl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showToast("Copied", "", "success");
        });
    };

    return (
        <VStack gap={15} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text
                            fontSize={"xs"}
                            bg={"gray.dark"}
                            color={"gray.light"}
                            p={1}
                            borderRadius={4}
                        >
                            threads.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    {user.profilePic ? (
                        <Avatar size={"md"} src={user.profilePic} />
                    ) : (
                        <Avatar size={"md"} src="https://bit.ly/broken-link" />
                    )}
                </Box>
            </Flex>
            <Text>{user.bio}</Text>
            {currentUser?._id === user._id ? (
                <Link as={RouterLink} to="/update">
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            ) : (
                <Button size={"sm"} onClick={handleFollow} isLoading={updating}>
                    {following ? "Unfollow" : "Follow"}
                </Button>
            )}
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{followerCount}</Text>
                    <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram />
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <BsThreeDots />
                            </MenuButton>
                            <Portal>
                                <MenuList
                                    sx={{
                                        width: "100px",
                                        fontSize: "sm",
                                        padding: "4px",
                                        margin: "0",
                                        bg: "gray.dark",
                                    }}
                                >
                                    <MenuItem onClick={copyurl}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <Flex
                    flex={1}
                    borderBottom={"1.5px solid white"}
                    justifyContent={"center"}
                    pb="3"
                    cursor={"pointer"}
                >
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={"1px solid gray"}
                    justifyContent={"center"}
                    pb="3"
                    cursor={"pointer"}
                >
                    <Text color={"gray.dark"} fontWeight={"bold"}>
                        Replies
                    </Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;
