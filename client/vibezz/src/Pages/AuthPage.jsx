import SignUp from "../Components/SignUp"
import Login from "../Components/Login"
import authScreenAtom from "../atoms/authAtom.js"
import { useSetRecoilState,useRecoilValue } from "recoil";

export const AuthPage = () => {
  const authScreenState=useRecoilValue(authScreenAtom);
  
  return (
    <>{authScreenState =='login' ? <Login/> :<SignUp/>}</>
  )
}
