import { Flex, useColorMode, Image, Link } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { BsHouseExclamationFill, BsPersonCircle } from "react-icons/bs";
import { Avatar } from "@chakra-ui/react"; 
import authAtom from "../atoms/authAtom.js"

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const authScreenAtom=useSetRecoilState(authAtom)

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
          <BsPersonCircle size="30" />
        </Link>
      )}
    </Flex>

    
  );
};



export default Header;
