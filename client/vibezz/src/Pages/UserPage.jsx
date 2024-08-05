import React, { useEffect, useState } from "react";
import UserHeader from "../Components/UserHeader";
import Post from "../Components/Post";
import { Flex, Spinner } from "@chakra-ui/react";
import { usegetpro } from "../hooks/usegetpro";
import { useShowToast } from '../hooks/useShowToast';
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
//

const UserPage = () => {
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
                  setLoading(false);
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
    

    if (!user && loading) {
        return (
            <Flex justifyContent='center'>
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />
            {!fetching && posts.length === 0 && <h1>They haven't posted yet!!!</h1>}
            {fetching && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy}  />
            ))}
        </>
    );
};

export default UserPage;
