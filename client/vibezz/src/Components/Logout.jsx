import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { IoLogOutSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { useShowToast } from "../hooks/useShowToast";
//

export const Logout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`https://vibe-zz.vercel.app/apiusers/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("ERROR", data.error, "error");
        return;
      }
      localStorage.removeItem("user-vibezz");
      setUser(null);
      navigate("/auth"); // Redirect to auth page after logout
    } catch (error) {
      console.log(error);
      showToast("ERROR", "Logout failed. Please try again.", "error");
    }
  };

  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size="sm"
      colorScheme="red" // Changed to camelCase
      onClick={handleLogout}
    >
      <IoLogOutSharp />
    </Button>
  );
};
